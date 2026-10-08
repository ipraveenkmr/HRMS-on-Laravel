import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../common/api_client.dart';
import '../constants.dart';
import '../controller/authentication.dart';
import '../door/widgets/cdotcomponents.dart';
import 'leave_page.dart';

class ApplyLeavePage extends StatefulWidget {
  const ApplyLeavePage({Key? key}) : super(key: key);

  @override
  State<ApplyLeavePage> createState() => _ApplyLeavePageState();
}

class _ApplyLeavePageState extends State<ApplyLeavePage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _reasonController = TextEditingController();

  DateTime _fromDate = DateTime.now();
  DateTime _toDate = DateTime.now();
  String _selectedLeaveType = 'Casual Leave';

  bool _isLoading = false;
  bool _isLoadingData = true;
  String? _conflictError;

  List<Map<String, dynamic>> _existingLeaves = [];
  Map<String, dynamic> _leaveBalances = {};

  final List<String> _leaveTypes = [
    'Casual Leave',
    'Earned Leave',
    'Medical Leave',
    'Other Leave',
    'Unpaid Leave',
  ];

  @override
  void initState() {
    super.initState();
    _fetchInitialData();
  }

  @override
  void dispose() {
    _reasonController.dispose();
    super.dispose();
  }

  String _formatDate(DateTime dt) => DateFormat('yyyy-MM-dd').format(dt);
  String _displayDate(DateTime dt) => DateFormat('EEE, MMM d, yyyy').format(dt);

  int get _calculatedDays {
    final from = DateTime(_fromDate.year, _fromDate.month, _fromDate.day);
    final to = DateTime(_toDate.year, _toDate.month, _toDate.day);
    if (to.isBefore(from)) return 0;
    return to.difference(from).inDays + 1;
  }

  String? _normalizeDate(Map leave, bool isFrom) {
    final raw = isFrom ? leave['leave_from_date'] : leave['leave_to_date'];
    if (raw == null || raw.toString().trim().isEmpty) return null;
    final str = raw.toString().trim();
    if (RegExp(r'^\d{4}-\d{2}-\d{2}$').hasMatch(str)) return str;

    final month = isFrom ? leave['leave_from_month'] : leave['leave_to_month'];
    final year = isFrom ? leave['leave_from_year'] : leave['leave_to_year'];
    if (month != null && year != null) {
      final d = str.padLeft(2, '0');
      final m = month.toString().padLeft(2, '0');
      final y = year.toString().length == 2 ? '20$year' : year.toString();
      return '$y-$m-$d';
    }
    try {
      return DateFormat('yyyy-MM-dd').format(DateTime.parse(str));
    } catch (_) {
      return null;
    }
  }

  Future<void> _fetchInitialData() async {
    setState(() => _isLoadingData = true);
    try {
      final prefs = await SharedPreferences.getInstance();
      final username = prefs.getString('username')?.toString() ?? '';
      if (username.isNotEmpty) {
        // 1. Fetch Leave Balances
        try {
          final balRes = await ApiClient.client.get('${AppConstants.apiLink}leave/calculator/username/$username');
          if (balRes.statusCode == 200 && balRes.data != null && (balRes.data as List).isNotEmpty) {
            _leaveBalances = Map<String, dynamic>.from(balRes.data[0]);
          }
        } catch (_) {}

        // 2. Fetch Existing Leaves for Overlap Detection
        try {
          final leavesRes = await ApiClient.client.get('${AppConstants.apiLink}leave/employee/$username');
          if (leavesRes.statusCode == 200 && leavesRes.data is List) {
            _existingLeaves = (leavesRes.data as List)
                .map((item) => Map<String, dynamic>.from(item))
                .toList();
          }
        } catch (_) {}
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoadingData = false;
        });
        _validateDateConflict();
      }
    }
  }

  void _validateDateConflict() {
    _conflictError = null;
    final selectedFromStr = _formatDate(_fromDate);
    final selectedToStr = _formatDate(_toDate);

    if (_toDate.isBefore(_fromDate)) {
      _conflictError = 'Leave "To" date cannot be before "From" date.';
      return;
    }

    for (var leave in _existingLeaves) {
      final status = leave['leave_status']?.toString() ?? '';
      if (status == 'Pending' || status == 'Approved') {
        final existingFromStr = _normalizeDate(leave, true);
        final existingToStr = _normalizeDate(leave, false);

        if (existingFromStr != null && existingToStr != null) {
          if (selectedFromStr.compareTo(existingToStr) <= 0 &&
              selectedToStr.compareTo(existingFromStr) >= 0) {
            _conflictError =
                'You already have a $status leave ($existingFromStr to $existingToStr) covering the selected dates.';
            break;
          }
        }
      }
    }
  }

  String _getBalanceForType(String type) {
    if (_leaveBalances.isEmpty) return '--';
    switch (type) {
      case 'Casual Leave':
        return '${_leaveBalances['remaining_CL_Days'] ?? _leaveBalances['remaining_cl_days'] ?? '0'} days';
      case 'Earned Leave':
        return '${_leaveBalances['remaining_EI_Days'] ?? _leaveBalances['remaining_ei_days'] ?? '0'} days';
      case 'Medical Leave':
        return '${_leaveBalances['remaining_medical_leave_in_days'] ?? '0'} days';
      case 'Other Leave':
        return '${_leaveBalances['remaining_other_leave_in_days'] ?? '0'} days';
      case 'Unpaid Leave':
        return '${_leaveBalances['remaining_LWP_Days'] ?? _leaveBalances['remaining_lwp_days'] ?? '30'} days';
      default:
        return '--';
    }
  }

  Future<void> _submitLeave() async {
    FocusScope.of(context).unfocus();
    _validateDateConflict();
    setState(() {});

    if (_conflictError != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(_conflictError!),
          backgroundColor: Colors.red.shade700,
        ),
      );
      return;
    }

    if (!_formKey.currentState!.validate()) return;

    final reason = _reasonController.text.trim();
    if (reason.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Please enter the reason for your leave.'),
          backgroundColor: Colors.orange.shade800,
        ),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      final error = await applyLeave(
        _formatDate(_fromDate),
        _formatDate(_toDate),
        reason,
        _selectedLeaveType,
      );

      if (error == null) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Leave application submitted successfully!'),
              backgroundColor: Colors.green,
              duration: Duration(seconds: 3),
            ),
          );
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => const LeavePage()),
          );
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(error),
              backgroundColor: Colors.red.shade700,
              duration: const Duration(seconds: 4),
            ),
          );
        }
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final primaryColor = Theme.of(context).primaryColor;
    final secondaryColor = Theme.of(context).colorScheme.secondary;

    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      appBar: AppBar(
        title: const Text(
          "Apply for Leave",
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white),
          tooltip: 'Back',
          onPressed: () {
            if (Navigator.canPop(context)) {
              Navigator.pop(context);
            } else {
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (context) => const LeavePage()),
              );
            }
          },
        ),
        iconTheme: const IconThemeData(color: Colors.white),
        flexibleSpace: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [primaryColor, secondaryColor],
            ),
          ),
        ),
      ),
      body: _isLoadingData
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.all(16.0),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Card(
                      elevation: 2,
                      shadowColor: Colors.black12,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(20.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(10),
                                  decoration: BoxDecoration(
                                    color: primaryColor.withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Icon(Icons.event_note_rounded, color: primaryColor, size: 28),
                                ),
                                const SizedBox(width: 14),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        "New Leave Request",
                                        style: TextStyle(
                                          fontSize: 18,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.grey.shade900,
                                        ),
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        "Submit dates for approval",
                                        style: TextStyle(fontSize: 13, color: Colors.grey.shade600),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 20),
                            Divider(color: Colors.grey.shade200, height: 1),
                            const SizedBox(height: 20),

                            // Leave Type Dropdown
                            const Text(
                              "Leave Category",
                              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                            ),
                            const SizedBox(height: 8),
                            DropdownButtonFormField<String>(
                              value: _selectedLeaveType,
                              decoration: InputDecoration(
                                prefixIcon: Icon(Icons.category_outlined, color: primaryColor),
                                filled: true,
                                fillColor: Colors.grey.shade50,
                                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: BorderSide(color: Colors.grey.shade300),
                                ),
                                enabledBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: BorderSide(color: Colors.grey.shade300),
                                ),
                                focusedBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: BorderSide(color: primaryColor, width: 2),
                                ),
                              ),
                              items: _leaveTypes.map((type) {
                                return DropdownMenuItem(
                                  value: type,
                                  child: Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(type, style: const TextStyle(fontWeight: FontWeight.w500)),
                                      Text(
                                        " (${_getBalanceForType(type)})",
                                        style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                                      ),
                                    ],
                                  ),
                                );
                              }).toList(),
                              onChanged: (val) {
                                if (val != null) {
                                  setState(() => _selectedLeaveType = val);
                                }
                              },
                            ),
                            const SizedBox(height: 20),

                            // From Date Picker
                            const Text(
                              "From Date",
                              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                            ),
                            const SizedBox(height: 8),
                            InkWell(
                              onTap: () async {
                                final picked = await showDatePicker(
                                  context: context,
                                  initialDate: _fromDate,
                                  firstDate: DateTime(2020),
                                  lastDate: DateTime(2030),
                                );
                                if (picked != null) {
                                  setState(() {
                                    _fromDate = picked;
                                    if (_toDate.isBefore(_fromDate)) {
                                      _toDate = _fromDate;
                                    }
                                  });
                                  _validateDateConflict();
                                }
                              },
                              borderRadius: BorderRadius.circular(12),
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                                decoration: BoxDecoration(
                                  color: Colors.grey.shade50,
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(color: Colors.grey.shade300),
                                ),
                                child: Row(
                                  children: [
                                    Icon(Icons.calendar_today_rounded, size: 20, color: primaryColor),
                                    const SizedBox(width: 12),
                                    Text(
                                      _displayDate(_fromDate),
                                      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                                    ),
                                    const Spacer(),
                                    Text(
                                      "Change",
                                      style: TextStyle(color: primaryColor, fontSize: 13, fontWeight: FontWeight.bold),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            const SizedBox(height: 20),

                            // To Date Picker
                            const Text(
                              "To Date",
                              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                            ),
                            const SizedBox(height: 8),
                            InkWell(
                              onTap: () async {
                                final picked = await showDatePicker(
                                  context: context,
                                  initialDate: _toDate.isBefore(_fromDate) ? _fromDate : _toDate,
                                  firstDate: _fromDate,
                                  lastDate: DateTime(2030),
                                );
                                if (picked != null) {
                                  setState(() {
                                    _toDate = picked;
                                  });
                                  _validateDateConflict();
                                }
                              },
                              borderRadius: BorderRadius.circular(12),
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                                decoration: BoxDecoration(
                                  color: Colors.grey.shade50,
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(color: Colors.grey.shade300),
                                ),
                                child: Row(
                                  children: [
                                    Icon(Icons.event_available_rounded, size: 20, color: primaryColor),
                                    const SizedBox(width: 12),
                                    Text(
                                      _displayDate(_toDate),
                                      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                                    ),
                                    const Spacer(),
                                    Text(
                                      "Change",
                                      style: TextStyle(color: primaryColor, fontSize: 13, fontWeight: FontWeight.bold),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            const SizedBox(height: 16),

                            // Duration Badge
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                              decoration: BoxDecoration(
                                color: Colors.blue.shade50,
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(color: Colors.blue.shade200),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(Icons.schedule, size: 16, color: Colors.blue.shade700),
                                  const SizedBox(width: 6),
                                  Text(
                                    "Total Duration: $_calculatedDays ${_calculatedDays == 1 ? 'Day' : 'Days'}",
                                    style: TextStyle(
                                      color: Colors.blue.shade800,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 13,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 20),

                            // Conflict Warning Banner
                            if (_conflictError != null) ...[
                              Container(
                                width: double.infinity,
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: Colors.red.shade50,
                                  borderRadius: BorderRadius.circular(10),
                                  border: Border.all(color: Colors.red.shade300),
                                ),
                                child: Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Icon(Icons.error_outline_rounded, color: Colors.red.shade700, size: 20),
                                    const SizedBox(width: 10),
                                    Expanded(
                                      child: Text(
                                        _conflictError!,
                                        style: TextStyle(
                                          color: Colors.red.shade900,
                                          fontSize: 13,
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 20),
                            ],

                            // Reason text field
                            const Text(
                              "Reason for Leave",
                              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                            ),
                            const SizedBox(height: 8),
                            TextFormField(
                              controller: _reasonController,
                              maxLines: 3,
                              maxLength: 99,
                              validator: (value) {
                                if (value == null || value.trim().isEmpty) {
                                  return 'Please provide a reason for the leave.';
                                }
                                return null;
                              },
                              decoration: InputDecoration(
                                hintText: 'Enter reason (e.g., family event, medical checkup)...',
                                filled: true,
                                fillColor: Colors.grey.shade50,
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: BorderSide(color: Colors.grey.shade300),
                                ),
                                enabledBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: BorderSide(color: Colors.grey.shade300),
                                ),
                                focusedBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: BorderSide(color: primaryColor, width: 2),
                                ),
                              ),
                            ),
                            const SizedBox(height: 24),

                            // Submit Button
                            SizedBox(
                              width: double.infinity,
                              height: 50,
                              child: ElevatedButton(
                                onPressed: (_isLoading || _conflictError != null) ? null : _submitLeave,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: primaryColor,
                                  foregroundColor: Colors.white,
                                  disabledBackgroundColor: Colors.grey.shade300,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  elevation: 2,
                                ),
                                child: _isLoading
                                    ? const SizedBox(
                                        height: 22,
                                        width: 22,
                                        child: CircularProgressIndicator(
                                          color: Colors.white,
                                          strokeWidth: 2.5,
                                        ),
                                      )
                                    : Row(
                                        mainAxisAlignment: MainAxisAlignment.center,
                                        children: const [
                                          Icon(Icons.send_rounded, size: 18),
                                          SizedBox(width: 8),
                                          Text(
                                            "Submit Application",
                                            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                                          ),
                                        ],
                                      ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}
