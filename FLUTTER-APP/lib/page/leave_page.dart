import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../constants.dart';
import '../door/widgets/cdotcomponents.dart';
import '../common/api_client.dart';
import 'apply_leave.dart';

class LeavePage extends StatefulWidget {
  const LeavePage({Key? key}) : super(key: key);

  @override
  State<LeavePage> createState() => _LeavePageState();
}

class _LeavePageState extends State<LeavePage> {
  List users = [];
  List leaves = [];
  String link = AppConstants.apiLink;
  String e_id = "";
  String remaining_CL_Days = "";
  String remaining_EI_Days = "";
  String remaining_LWP_Days = "";
  String remaining_other_leave_in_days = "";
  String remaining_medical_leave_in_days = "";

  Future<void> editLeave(Map leave) async {
    final reason = TextEditingController(text: leave['leave_reason']?.toString() ?? '');
    DateTime from = DateTime.tryParse(leave['leave_from_date']?.toString() ?? '') ?? DateTime.now();
    DateTime to = DateTime.tryParse(leave['leave_to_date']?.toString() ?? '') ?? from;
    String? selectedType = leave['leave_type']?.toString();
    final saved = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => StatefulBuilder(
        builder: (context, update) => AlertDialog(
          title: const Text('Edit pending leave'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: reason,
                decoration: const InputDecoration(labelText: 'Reason'),
                maxLength: 99,
              ),
              DropdownButtonFormField<String>(
                value: selectedType,
                hint: const Text('Leave type'),
                items: ['Casual Leave', 'Earned Leave', 'Medical Leave', 'Other Leave', 'Unpaid Leave']
                    .map((value) => DropdownMenuItem(value: value, child: Text(value)))
                    .toList(),
                onChanged: (value) => update(() => selectedType = value),
              ),
              TextButton(
                onPressed: () async {
                  final picked = await showDatePicker(
                    context: context,
                    initialDate: from,
                    firstDate: DateTime(2020),
                    lastDate: DateTime(2100),
                  );
                  if (picked != null) update(() => from = picked);
                },
                child: Text('From: ${from.year}-${from.month.toString().padLeft(2, '0')}-${from.day.toString().padLeft(2, '0')}'),
              ),
              TextButton(
                onPressed: () async {
                  final picked = await showDatePicker(
                    context: context,
                    initialDate: to,
                    firstDate: from,
                    lastDate: DateTime(2100),
                  );
                  if (picked != null) update(() => to = picked);
                },
                child: Text('To: ${to.year}-${to.month.toString().padLeft(2, '0')}-${to.day.toString().padLeft(2, '0')}'),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(dialogContext, false),
              child: const Text('Cancel'),
            ),
            FilledButton(
              onPressed: () async {
                if (reason.text.trim().isEmpty || to.isBefore(from)) {
                  ScaffoldMessenger.of(this.context).showSnackBar(
                    const SnackBar(content: Text('Enter a reason and a valid date range.')),
                  );
                  return;
                }
                try {
                  final format = (DateTime value) =>
                      '${value.year}-${value.month.toString().padLeft(2, '0')}-${value.day.toString().padLeft(2, '0')}';
                  await ApiClient.client.put('$link' 'leave/${leave['id']}', data: {
                    'leave_reason': reason.text.trim(),
                    'leave_from_date': format(from),
                    'leave_to_date': format(to),
                    if (selectedType != null) 'leave_type': selectedType,
                  });
                  if (dialogContext.mounted) Navigator.pop(dialogContext, true);
                } on DioException catch (e) {
                  final detail = e.response?.data is Map
                      ? e.response?.data['detail'] ?? e.response?.data['message']
                      : null;
                  if (mounted) {
                    ScaffoldMessenger.of(this.context).showSnackBar(
                      SnackBar(content: Text(detail?.toString() ?? 'Could not update leave.')),
                    );
                  }
                }
              },
              child: const Text('Save'),
            ),
          ],
        ),
      ),
    );
    reason.dispose();
    if (saved == true) {
      refreshData();
    }
  }

  Future<void> deleteLeave(Map leave) async {
    final status = leave['leave_status']?.toString() ?? '';
    if (status != 'Pending') {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Only pending leave requests can be deleted.'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    final leaveId = leave['id'];
    if (leaveId == null) return;

    final confirmed = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Row(
          children: [
            Icon(Icons.warning_amber_rounded, color: Colors.red),
            SizedBox(width: 8),
            Text('Delete Leave Request', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          ],
        ),
        content: const Text('Are you sure you want to delete this pending leave request? This action cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext, false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () => Navigator.pop(dialogContext, true),
            child: const Text('Delete'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      try {
        final response = await ApiClient.client.delete('${link}leave/$leaveId');
        if (response.statusCode == 200) {
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Leave request deleted successfully.'),
                backgroundColor: Colors.green,
                duration: Duration(seconds: 3),
              ),
            );
            refreshData();
          }
        }
      } on DioException catch (e) {
        final detail = e.response?.data is Map
            ? e.response?.data['detail'] ?? e.response?.data['message'] ?? e.response?.data['error']
            : null;
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(detail?.toString() ?? 'Could not delete leave request.'),
              backgroundColor: Colors.red.shade700,
            ),
          );
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Error deleting leave: $e'),
              backgroundColor: Colors.red.shade700,
            ),
          );
        }
      }
    }
  }

  void refreshData() {
    getLeave();
    getUsers().then((data) {
      if (mounted) setState(() => users = data ?? []);
    });
  }

  @override
  void initState() {
    super.initState();
    refreshData();
  }

  getLeave() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String username = prefs.getString('username')?.toString() ?? '';
    if (username.isEmpty) return;
    try {
      var response = await ApiClient.client.get(link + "leave/calculator/username/" + username);
      if (response.statusCode == 200 && response.data != null) {
        dynamic data;
        if (response.data is List && (response.data as List).isNotEmpty) {
          data = (response.data as List)[0];
        } else if (response.data is Map) {
          data = response.data;
        }

        if (data != null && mounted) {
          setState(() {
            remaining_CL_Days = data['remaining_CL_Days']?.toString() ??
                data['remaining_cl_days']?.toString() ?? '0';
            remaining_EI_Days = data['remaining_EI_Days']?.toString() ??
                data['remaining_ei_days']?.toString() ?? '0';
            remaining_LWP_Days = data['remaining_LWP_Days']?.toString() ??
                data['remaining_lwp_days']?.toString() ?? '0';
            remaining_other_leave_in_days =
                data['remaining_other_leave_in_days']?.toString() ?? '0';
            remaining_medical_leave_in_days =
                data['remaining_medical_leave_in_days']?.toString() ?? '0';
          });
        }
      }
    } catch (e) {
      print("Error fetching leave calculator: $e");
    }
  }

  getUsers() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String username = prefs.getString('username')?.toString() ?? '';
    if (username.isEmpty) return [];
    var response = await ApiClient.client.get(link + "leave/employee/" + username);
    if (response.data is List) {
      final list = List.from(response.data);
      list.sort((a, b) {
        final idA = a['id'] is int ? a['id'] as int : int.tryParse(a['id']?.toString() ?? '') ?? 0;
        final idB = b['id'] is int ? b['id'] as int : int.tryParse(b['id']?.toString() ?? '') ?? 0;
        if (idA != 0 && idB != 0 && idA != idB) {
          return idB.compareTo(idA);
        }
        final dateA = a['leave_from_date']?.toString() ?? '';
        final dateB = b['leave_from_date']?.toString() ?? '';
        return dateB.compareTo(dateA);
      });
      return list;
    }
    return response.data;
  }

  Widget buildText(String text) => Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 20.0),
          child: Text(
            text,
            style: TextStyle(fontSize: 16, color: Colors.grey.shade600),
          ),
        ),
      );

  @override
  Widget build(BuildContext context) {
    final primaryColor = Theme.of(context).primaryColor;
    final accentColor = Theme.of(context).colorScheme.secondary;

    return Scaffold(
      backgroundColor: Colors.grey.shade100,
      appBar: AppBar(
        title: const Text(
          "My Leaves",
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
        flexibleSpace: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [primaryColor, accentColor],
            ),
          ),
        ),
      ),
      drawer: CdotComponents.sidenav(),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () async {
          await Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const ApplyLeavePage()),
          );
          refreshData();
        },
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text(
          "Apply Leave",
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
        ),
        backgroundColor: primaryColor,
        elevation: 4,
      ),
      body: RefreshIndicator(
        onRefresh: () async => refreshData(),
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(parent: BouncingScrollPhysics()),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Leave Balance",
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.grey.shade800,
                  ),
                ),
                const SizedBox(height: 12),
                GridView.count(
                  crossAxisCount: 2,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                  childAspectRatio: 1.35,
                  children: [
                    _buildBalanceCard("Casual Leave", remaining_CL_Days,
                        [Colors.blue.shade400, Colors.blue.shade700]),
                    _buildBalanceCard("Earned Leave", remaining_EI_Days,
                        [Colors.teal.shade400, Colors.teal.shade700]),
                    _buildBalanceCard("Leave Without Pay", remaining_LWP_Days,
                        [Colors.orange.shade400, Colors.orange.shade700]),
                    _buildBalanceCard(
                        "Medical Leave",
                        remaining_medical_leave_in_days,
                        [Colors.purple.shade400, Colors.purple.shade700]),
                    _buildBalanceCard(
                        "Other Leave",
                        remaining_other_leave_in_days,
                        [Colors.blueGrey.shade400, Colors.blueGrey.shade700]),
                  ],
                ),
                const SizedBox(height: 25),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      "Leave History",
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.grey.shade800,
                      ),
                    ),
                    if (AppConstants.dummyMode)
                      Text(
                        "Dummy Mode Active",
                        style: TextStyle(
                          fontSize: 11,
                          color: Colors.amber.shade800,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 12),
                FutureBuilder(
                  future: getUsers(),
                  builder: (context, AsyncSnapshot snapshot) {
                    switch (snapshot.connectionState) {
                      case ConnectionState.waiting:
                        return const Center(
                          child: Padding(
                            padding: EdgeInsets.symmetric(vertical: 30.0),
                            child: CircularProgressIndicator(),
                          ),
                        );
                      default:
                        if (snapshot.hasError) {
                          return buildText('Something Went Wrong Try later');
                        }
                        if (!snapshot.hasData || (users.isEmpty)) {
                          return buildText('No Leaves Applied Yet');
                        }

                        return ListView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: users.length,
                          itemBuilder: (BuildContext context, int index) {
                            final leave = users[index];
                            final status = leave['leave_status']?.toString() ?? 'Pending';
                            final leaveType = leave['leave_type']?.toString() ?? 'Leave';

                            Color statusColor = Colors.orange;
                            Color statusBg = Colors.orange.shade50;
                            if (status == 'Approved') {
                              statusColor = Colors.green;
                              statusBg = Colors.green.shade50;
                            } else if (status == 'Rejected' || status == 'Cancelled') {
                              statusColor = Colors.red;
                              statusBg = Colors.red.shade50;
                            }

                            return Card(
                              elevation: 1,
                              margin: const EdgeInsets.only(bottom: 12),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                                side: BorderSide(color: Colors.grey.shade200),
                              ),
                              child: Padding(
                                padding: const EdgeInsets.all(16.0),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                leave['leave_reason'] ?? 'Personal Leave',
                                                style: const TextStyle(
                                                  fontWeight: FontWeight.bold,
                                                  fontSize: 15,
                                                ),
                                              ),
                                              const SizedBox(height: 4),
                                              Container(
                                                padding: const EdgeInsets.symmetric(
                                                  horizontal: 8,
                                                  vertical: 2,
                                                ),
                                                decoration: BoxDecoration(
                                                  color: Colors.blueGrey.shade50,
                                                  borderRadius: BorderRadius.circular(6),
                                                ),
                                                child: Text(
                                                  leaveType,
                                                  style: TextStyle(
                                                    fontSize: 11,
                                                    color: Colors.blueGrey.shade800,
                                                    fontWeight: FontWeight.w600,
                                                  ),
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.symmetric(
                                            horizontal: 10,
                                            vertical: 4,
                                          ),
                                          decoration: BoxDecoration(
                                            color: statusBg,
                                            borderRadius: BorderRadius.circular(8),
                                            border: Border.all(
                                              color: statusColor.withOpacity(0.3),
                                            ),
                                          ),
                                          child: Text(
                                            status,
                                            style: TextStyle(
                                              color: statusColor,
                                              fontWeight: FontWeight.bold,
                                              fontSize: 12,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 12),
                                    Divider(color: Colors.grey.shade100, height: 1),
                                    const SizedBox(height: 12),
                                    Row(
                                      children: [
                                        Expanded(
                                          child: Row(
                                            children: [
                                              Icon(
                                                Icons.date_range,
                                                size: 16,
                                                color: Colors.grey.shade500,
                                              ),
                                              const SizedBox(width: 6),
                                              Text(
                                                "Duration: ",
                                                style: TextStyle(
                                                  color: Colors.grey.shade600,
                                                  fontSize: 13,
                                                ),
                                              ),
                                              Expanded(
                                                child: Text(
                                                  "${leave['leave_from_date'] ?? 'N/A'} to ${leave['leave_to_date'] ?? 'N/A'}",
                                                  overflow: TextOverflow.ellipsis,
                                                  style: TextStyle(
                                                    fontWeight: FontWeight.w600,
                                                    fontSize: 13,
                                                    color: Colors.grey.shade800,
                                                  ),
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                        if (status == 'Pending') ...[
                                          const SizedBox(width: 8),
                                          InkWell(
                                            onTap: () => editLeave(leave),
                                            borderRadius: BorderRadius.circular(6),
                                            child: Padding(
                                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
                                              child: Row(
                                                mainAxisSize: MainAxisSize.min,
                                                children: [
                                                  Icon(Icons.edit_outlined, size: 15, color: primaryColor),
                                                  const SizedBox(width: 3),
                                                  Text(
                                                    'Edit',
                                                    style: TextStyle(
                                                      fontSize: 12,
                                                      color: primaryColor,
                                                      fontWeight: FontWeight.w600,
                                                    ),
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ),
                                          const SizedBox(width: 4),
                                          InkWell(
                                            onTap: () => deleteLeave(leave),
                                            borderRadius: BorderRadius.circular(6),
                                            child: const Padding(
                                              padding: EdgeInsets.symmetric(horizontal: 6, vertical: 4),
                                              child: Row(
                                                mainAxisSize: MainAxisSize.min,
                                                children: [
                                                  Icon(Icons.delete_outline, size: 15, color: Colors.red),
                                                  SizedBox(width: 3),
                                                  Text(
                                                    'Delete',
                                                    style: TextStyle(
                                                      fontSize: 12,
                                                      color: Colors.red,
                                                      fontWeight: FontWeight.w600,
                                                    ),
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ),
                                        ],
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            );
                          },
                        );
                    }
                  },
                ),
                const SizedBox(height: 60), // Spacing for FAB
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildBalanceCard(
      String title, String count, List<Color> gradientColors) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        gradient: LinearGradient(
          colors: gradientColors,
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        boxShadow: [
          BoxShadow(
            color: gradientColors[1].withOpacity(0.25),
            blurRadius: 8,
            offset: const Offset(0, 4),
          )
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(14.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              title,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                color: Colors.white70,
                fontSize: 11,
                fontWeight: FontWeight.bold,
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  count.isEmpty ? "0" : count,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 26,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const Icon(
                  Icons.calendar_today,
                  color: Colors.white24,
                  size: 24,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
