import 'dart:io';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:path_provider/path_provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../common/api_client.dart';
import '../constants.dart';
import '../door/widgets/cdotcomponents.dart';

class TaskPage extends StatefulWidget {
  const TaskPage({super.key});

  @override
  State<TaskPage> createState() => _TaskPageState();
}

class _TaskPageState extends State<TaskPage> with TickerProviderStateMixin {
  late TabController _tabController;

  // Daily Tasks State
  List<Map<String, dynamic>> dailyTasks = [];
  bool loadingDaily = false;
  String? errorDaily;
  DateTime? filterFrom;
  DateTime? filterTo;
  String filterStatus = '';

  // Report Download State
  String reportPeriod = 'weekly';
  DateTime reportDate = DateTime.now();
  String reportStatus = '';
  bool downloadingReport = false;

  // Assigned Tasks State
  List<Map<String, dynamic>> assignedTasks = [];
  bool loadingAssigned = false;
  String? errorAssigned;

  final DateFormat _apiDateFormat = DateFormat('yyyy-MM-dd');
  final DateFormat _displayDateFormat = DateFormat('EEE, dd MMM yyyy');

  String _formatApiDate(DateTime value) => _apiDateFormat.format(value);

  String _formatDisplayDate(String? rawDate) {
    if (rawDate == null || rawDate.isEmpty) return '—';
    try {
      final parsed = DateTime.parse(rawDate);
      return _displayDateFormat.format(parsed);
    } catch (_) {
      return rawDate;
    }
  }

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    fetchDailyTasks();
    fetchAssignedTasks();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  // ==========================================
  // DAILY TASKS API METHODS (CRUD + FILTERS + REPORTS)
  // ==========================================

  Future<void> fetchDailyTasks() async {
    setState(() {
      loadingDaily = true;
      errorDaily = null;
    });

    try {
      final prefs = await SharedPreferences.getInstance();
      final uname = prefs.getString('username');

      final query = <String, dynamic>{
        if (uname != null && uname.isNotEmpty) 'username': uname,
        if (filterFrom != null) 'from': _formatApiDate(filterFrom!),
        if (filterTo != null) 'to': _formatApiDate(filterTo!),
        if (filterStatus.isNotEmpty) 'status': filterStatus,
      };

      final response = await ApiClient.client.get(
        '${AppConstants.apiLink}daily-tasks',
        queryParameters: query,
      );

      if (mounted) {
        if (response.data is List) {
          final list = (response.data as List)
              .map((item) => Map<String, dynamic>.from(item))
              .toList();
          list.sort((a, b) {
            final idA = a['id'] is int ? a['id'] as int : int.tryParse(a['id']?.toString() ?? '') ?? 0;
            final idB = b['id'] is int ? b['id'] as int : int.tryParse(b['id']?.toString() ?? '') ?? 0;
            if (idA != 0 && idB != 0 && idA != idB) {
              return idB.compareTo(idA);
            }
            final dateA = a['submission_date']?.toString() ?? a['created_at']?.toString() ?? '';
            final dateB = b['submission_date']?.toString() ?? b['created_at']?.toString() ?? '';
            return dateB.compareTo(dateA);
          });
          setState(() => dailyTasks = list);
        }
      }
    } on DioException catch (e) {
      if (mounted) {
        setState(() => errorDaily = _extractDioError(e, 'Could not load daily tasks.'));
      }
    } catch (e) {
      if (mounted) {
        setState(() => errorDaily = 'Unexpected error: ${e.toString()}');
      }
    } finally {
      if (mounted) {
        setState(() => loadingDaily = false);
      }
    }
  }

  Future<void> fetchAssignedTasks() async {
    setState(() {
      loadingAssigned = true;
      errorAssigned = null;
    });

    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      String username = prefs.getString('username')?.toString() ?? '';
      if (username.isEmpty) {
        setState(() {
          assignedTasks = [];
          loadingAssigned = false;
        });
        return;
      }

      final response = await ApiClient.client.get('${AppConstants.apiLink}tasks/employee/$username');
      if (mounted && response.data is List) {
        final list = (response.data as List)
            .map((item) => Map<String, dynamic>.from(item))
            .toList();
        list.sort((a, b) {
          final idA = a['id'] is int ? a['id'] as int : int.tryParse(a['id']?.toString() ?? '') ?? 0;
          final idB = b['id'] is int ? b['id'] as int : int.tryParse(b['id']?.toString() ?? '') ?? 0;
          return idB.compareTo(idA);
        });
        setState(() => assignedTasks = list);
      }
    } on DioException catch (e) {
      if (mounted) {
        setState(() => errorAssigned = _extractDioError(e, 'Could not load assigned tasks.'));
      }
    } catch (e) {
      if (mounted) {
        setState(() => errorAssigned = 'Unexpected error: ${e.toString()}');
      }
    } finally {
      if (mounted) {
        setState(() => loadingAssigned = false);
      }
    }
  }

  String _extractDioError(DioException e, String fallback) {
    if (e.response?.data is Map) {
      final data = e.response!.data as Map;
      if (data['detail'] != null && data['detail'].toString().trim().isNotEmpty) {
        return data['detail'].toString();
      }
      if (data['message'] != null && data['message'].toString().trim().isNotEmpty) {
        return data['message'].toString();
      }
      if (data['errors'] is Map) {
        final errors = data['errors'] as Map;
        if (errors.isNotEmpty) {
          final first = errors.values.first;
          if (first is List && first.isNotEmpty) return first.first.toString();
          return first.toString();
        }
      }
    }
    if (e.response?.statusCode == 401) return 'Session expired. Please sign in again.';
    if (e.response?.statusCode == 403) return 'Access denied.';
    if (e.type == DioExceptionType.connectionError || e.type == DioExceptionType.connectionTimeout) {
      return 'Cannot reach backend server. Ensure server is active.';
    }
    return fallback;
  }

  // ==========================================
  // CREATE / EDIT DAILY TASK DIALOG
  // ==========================================

  Future<void> openDailyTaskForm([Map<String, dynamic>? existing]) async {
    final result = await showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (bottomSheetContext) => _DailyTaskFormSheet(
        existing: existing,
        extractDioError: _extractDioError,
      ),
    );

    if (result == true && mounted) {
      if (_tabController.index != 0) {
        _tabController.animateTo(0);
      }
      await fetchDailyTasks();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(existing == null ? 'Task added successfully!' : 'Task updated!'),
            backgroundColor: Colors.green.shade700,
          ),
        );
      }
    }
  }

  // ==========================================
  // VIEW TASK DETAILS MODAL
  // ==========================================

  void viewTaskDetails(Map<String, dynamic> task) {
    final status = task['status']?.toString() ?? 'Pending';
    final taskTitle = task['task']?.toString() ?? 'Untitled Task';
    final desc = task['description']?.toString() ?? 'No description provided.';
    final subDate = _formatDisplayDate(task['submission_date']?.toString());
    final manager = task['manager']?.toString();
    final empName = task['employee'] is Map ? task['employee']['emp_name'] : task['username'];

    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (context) => Container(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: _getStatusBgColor(status),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: _getStatusColor(status).withValues(alpha: 0.3)),
                  ),
                  child: Text(
                    status,
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: _getStatusColor(status)),
                  ),
                ),
                Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.edit_rounded, color: Colors.blueAccent),
                      tooltip: 'Edit',
                      onPressed: () {
                        Navigator.pop(context);
                        openDailyTaskForm(task);
                      },
                    ),
                    IconButton(
                      icon: const Icon(Icons.delete_outline_rounded, color: Colors.redAccent),
                      tooltip: 'Delete',
                      onPressed: () {
                        Navigator.pop(context);
                        confirmDeleteTask(task);
                      },
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 10),
            Text(taskTitle, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            Row(
              children: [
                Icon(Icons.calendar_today_rounded, size: 15, color: Colors.grey.shade600),
                const SizedBox(width: 6),
                Text('Date: $subDate', style: TextStyle(fontSize: 13, color: Colors.grey.shade700)),
              ],
            ),
            if (empName != null && empName.toString().isNotEmpty) ...[
              const SizedBox(height: 6),
              Row(
                children: [
                  Icon(Icons.person_outline_rounded, size: 15, color: Colors.grey.shade600),
                  const SizedBox(width: 6),
                  Text('Employee: $empName', style: TextStyle(fontSize: 13, color: Colors.grey.shade700)),
                ],
              ),
            ],
            if (manager != null && manager.isNotEmpty) ...[
              const SizedBox(height: 6),
              Row(
                children: [
                  Icon(Icons.supervisor_account_outlined, size: 15, color: Colors.grey.shade600),
                  const SizedBox(width: 6),
                  Text('Supervisor: $manager', style: TextStyle(fontSize: 13, color: Colors.grey.shade700)),
                ],
              ),
            ],
            const Divider(height: 24),
            const Text('Description', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
            const SizedBox(height: 6),
            Text(desc, style: TextStyle(fontSize: 14, color: Colors.grey.shade800, height: 1.4)),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  // ==========================================
  // DELETE TASK CONFIRMATION
  // ==========================================

  Future<void> confirmDeleteTask(Map<String, dynamic> task) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Daily Task?'),
        content: Text("Are you sure you want to delete '${task['task']}'? This action cannot be undone."),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: Colors.red.shade600),
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Delete'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      try {
        await ApiClient.client.delete('${AppConstants.apiLink}daily-tasks/${task['id']}');
        fetchDailyTasks();
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Task deleted successfully.')),
          );
        }
      } on DioException catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(_extractDioError(e, 'Could not delete task.')), backgroundColor: Colors.red.shade700),
          );
        }
      }
    }
  }

  // ==========================================
  // DOWNLOAD REPORTS (WEEKLY / MONTHLY IN CSV / PDF)
  // ==========================================

  Future<void> openReportDownloadDialog() async {
    String selectedPeriod = reportPeriod;
    DateTime selectedRefDate = reportDate;
    String selectedStatus = reportStatus;

    await showDialog(
      context: context,
      builder: (dialogContext) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: const Row(
            children: [
              Icon(Icons.download_rounded, color: Colors.blueAccent),
              SizedBox(width: 8),
              Text('Download Report', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            ],
          ),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Report Frequency', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                const SizedBox(height: 6),
                SegmentedButton<String>(
                  segments: const [
                    ButtonSegment(value: 'weekly', label: Text('Weekly')),
                    ButtonSegment(value: 'monthly', label: Text('Monthly')),
                  ],
                  selected: {selectedPeriod},
                  onSelectionChanged: (set) => setDialogState(() => selectedPeriod = set.first),
                ),
                const SizedBox(height: 16),

                const Text('Reference Date', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                const SizedBox(height: 6),
                InkWell(
                  onTap: () async {
                    final picked = await showDatePicker(
                      context: context,
                      initialDate: selectedRefDate,
                      firstDate: DateTime(2020),
                      lastDate: DateTime(2035),
                    );
                    if (picked != null) setDialogState(() => selectedRefDate = picked);
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.grey.shade300),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(_formatApiDate(selectedRefDate), style: const TextStyle(fontWeight: FontWeight.w600)),
                        const Icon(Icons.calendar_today_rounded, size: 18, color: Colors.blueAccent),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                const Text('Filter by Status', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                const SizedBox(height: 6),
                DropdownButtonFormField<String>(
                  initialValue: selectedStatus,
                  decoration: InputDecoration(
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                  items: const [
                    DropdownMenuItem(value: '', child: Text('All Statuses')),
                    DropdownMenuItem(value: 'Pending', child: Text('Pending')),
                    DropdownMenuItem(value: 'In Progress', child: Text('In Progress')),
                    DropdownMenuItem(value: 'Completed', child: Text('Completed')),
                  ],
                  onChanged: (val) => setDialogState(() => selectedStatus = val ?? ''),
                ),
                const SizedBox(height: 20),

                // Download Buttons (CSV and PDF)
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        icon: const Icon(Icons.table_chart_rounded, size: 18, color: Colors.green),
                        label: const Text('CSV Format'),
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                        onPressed: () {
                          Navigator.pop(dialogContext);
                          _downloadReportFile(
                            period: selectedPeriod,
                            date: selectedRefDate,
                            format: 'csv',
                            status: selectedStatus,
                          );
                        },
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: ElevatedButton.icon(
                        icon: const Icon(Icons.picture_as_pdf_rounded, size: 18),
                        label: const Text('PDF Format'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.red.shade700,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                        onPressed: () {
                          Navigator.pop(dialogContext);
                          _downloadReportFile(
                            period: selectedPeriod,
                            date: selectedRefDate,
                            format: 'pdf',
                            status: selectedStatus,
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(dialogContext),
              child: const Text('Close'),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _downloadReportFile({
    required String period,
    required DateTime date,
    required String format,
    required String status,
  }) async {
    setState(() => downloadingReport = true);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const SizedBox(
              width: 18,
              height: 18,
              child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
            ),
            const SizedBox(width: 12),
            Text('Generating $period $format report...'),
          ],
        ),
        duration: const Duration(seconds: 2),
      ),
    );

    try {
      final prefs = await SharedPreferences.getInstance();
      final uname = prefs.getString('username');

      final response = await ApiClient.client.get(
        '${AppConstants.apiLink}daily-tasks/report/download',
        queryParameters: {
          if (uname != null && uname.isNotEmpty) 'username': uname,
          'period': period,
          'date': _formatApiDate(date),
          'format': format,
          if (status.isNotEmpty) 'status': status,
        },
        options: Options(responseType: ResponseType.bytes),
      );

      final directory = await getDownloadsDirectory() ?? await getApplicationDocumentsDirectory();
      final dateStr = _formatApiDate(date);
      final filename = 'daily-tasks-$period-$dateStr.$format';
      final file = File('${directory.path}/$filename');
      await file.writeAsBytes(List<int>.from(response.data));

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Report saved to: ${file.path}'),
            backgroundColor: Colors.green.shade700,
            duration: const Duration(seconds: 5),
            action: SnackBarAction(
              label: 'OK',
              textColor: Colors.white,
              onPressed: () {},
            ),
          ),
        );
      }
    } on DioException catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(_extractDioError(e, 'Could not download report.')),
            backgroundColor: Colors.red.shade700,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error saving report: ${e.toString()}'),
            backgroundColor: Colors.red.shade700,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => downloadingReport = false);
    }
  }

  // ==========================================
  // DATE RANGE FILTER FOR DAILY TASKS
  // ==========================================

  Future<void> _pickFilterDateRange() async {
    final now = DateTime.now();
    final picked = await showDateRangePicker(
      context: context,
      firstDate: DateTime(2020),
      lastDate: DateTime(2035),
      initialDateRange: (filterFrom != null && filterTo != null)
          ? DateTimeRange(start: filterFrom!, end: filterTo!)
          : DateTimeRange(start: now.subtract(const Duration(days: 30)), end: now),
    );

    if (picked != null) {
      setState(() {
        filterFrom = picked.start;
        filterTo = picked.end;
      });
      fetchDailyTasks();
    }
  }

  void _clearDailyFilters() {
    setState(() {
      filterFrom = null;
      filterTo = null;
      filterStatus = '';
    });
    fetchDailyTasks();
  }

  // ==========================================
  // HELPERS FOR COLORS & BADGES
  // ==========================================

  Color _getStatusColor(String? status) {
    switch ((status ?? '').toLowerCase()) {
      case 'completed':
        return Colors.green.shade700;
      case 'in progress':
        return Colors.blue.shade700;
      case 'pending':
      default:
        return Colors.orange.shade800;
    }
  }

  Color _getStatusBgColor(String? status) {
    switch ((status ?? '').toLowerCase()) {
      case 'completed':
        return Colors.green.shade50;
      case 'in progress':
        return Colors.blue.shade50;
      case 'pending':
      default:
        return Colors.orange.shade50;
    }
  }

  IconData _getStatusIcon(String? status) {
    switch ((status ?? '').toLowerCase()) {
      case 'completed':
        return Icons.check_circle_outline_rounded;
      case 'in progress':
        return Icons.timelapse_rounded;
      case 'pending':
      default:
        return Icons.pending_actions_rounded;
    }
  }

  // ==========================================
  // BUILD METHOD
  // ==========================================

  @override
  Widget build(BuildContext context) {
    final primaryColor = Theme.of(context).primaryColor;
    final accentColor = Theme.of(context).colorScheme.secondary;

    return Scaffold(
      backgroundColor: Colors.grey.shade100,
      appBar: AppBar(
        title: const Text(
          "Tasks",
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
        actions: [
          IconButton(
            icon: const Icon(Icons.download_rounded),
            tooltip: 'Download Report',
            onPressed: openReportDownloadDialog,
          ),
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            tooltip: 'Refresh',
            onPressed: () {
              fetchDailyTasks();
              fetchAssignedTasks();
            },
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: Colors.white,
          indicatorWeight: 3,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          tabs: const [
            Tab(icon: Icon(Icons.edit_calendar_rounded), text: 'Daily Tasks'),
            Tab(icon: Icon(Icons.assignment_turned_in_rounded), text: 'Assigned Tasks'),
          ],
        ),
      ),
      drawer: CdotComponents.sidenav(),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: primaryColor,
        icon: const Icon(Icons.add_rounded, color: Colors.white),
        label: const Text('Add Daily Task', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        onPressed: () => openDailyTaskForm(),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildDailyTasksTab(),
          _buildAssignedTasksTab(),
        ],
      ),
    );
  }

  // ==========================================
  // TAB 1: DAILY TASKS (CRUD + FILTERS)
  // ==========================================

  Widget _buildDailyTasksTab() {
    final hasActiveFilter = filterFrom != null || filterTo != null || filterStatus.isNotEmpty;

    return Column(
      children: [
        // Filter Bar
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
          decoration: BoxDecoration(
            color: Colors.white,
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.04),
                offset: const Offset(0, 2),
                blurRadius: 6,
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  // Date Range Button
                  Expanded(
                    flex: 3,
                    child: OutlinedButton.icon(
                      onPressed: _pickFilterDateRange,
                      icon: const Icon(Icons.date_range_rounded, size: 18),
                      label: Text(
                        (filterFrom != null && filterTo != null)
                            ? '${DateFormat('dd MMM').format(filterFrom!)} - ${DateFormat('dd MMM').format(filterTo!)}'
                            : 'Date Range',
                        style: const TextStyle(fontSize: 13),
                        overflow: TextOverflow.ellipsis,
                      ),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),

                  // Status Dropdown
                  Expanded(
                    flex: 2,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10),
                      decoration: BoxDecoration(
                        border: Border.all(color: Colors.grey.shade300),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: DropdownButtonHideUnderline(
                        child: DropdownButton<String>(
                          value: filterStatus,
                          isExpanded: true,
                          items: const [
                            DropdownMenuItem(value: '', child: Text('All', style: TextStyle(fontSize: 13))),
                            DropdownMenuItem(value: 'Pending', child: Text('Pending', style: TextStyle(fontSize: 13))),
                            DropdownMenuItem(value: 'In Progress', child: Text('In Progress', style: TextStyle(fontSize: 13))),
                            DropdownMenuItem(value: 'Completed', child: Text('Completed', style: TextStyle(fontSize: 13))),
                          ],
                          onChanged: (val) {
                            setState(() => filterStatus = val ?? '');
                            fetchDailyTasks();
                          },
                        ),
                      ),
                    ),
                  ),

                  if (hasActiveFilter) ...[
                    const SizedBox(width: 6),
                    IconButton(
                      onPressed: _clearDailyFilters,
                      icon: const Icon(Icons.clear_rounded, color: Colors.redAccent),
                      tooltip: 'Clear Filters',
                    ),
                  ],
                ],
              ),
              if (dailyTasks.isNotEmpty)
                Padding(
                  padding: const EdgeInsets.only(top: 6, left: 2),
                  child: Text(
                    '${dailyTasks.length} daily task${dailyTasks.length == 1 ? '' : 's'} recorded',
                    style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                  ),
                ),
            ],
          ),
        ),

        if (loadingDaily) const LinearProgressIndicator(minHeight: 2),

        // Body List
        Expanded(
          child: RefreshIndicator(
            onRefresh: fetchDailyTasks,
            child: _buildDailyTasksList(),
          ),
        ),
      ],
    );
  }

  Widget _buildDailyTasksList() {
    if (errorDaily != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.error_outline_rounded, size: 50, color: Colors.red.shade400),
              const SizedBox(height: 12),
              Text(
                'Could not load tasks',
                style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: Colors.grey.shade800),
              ),
              const SizedBox(height: 6),
              Text(
                errorDaily!,
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 13, color: Colors.grey.shade600),
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: fetchDailyTasks,
                icon: const Icon(Icons.refresh_rounded),
                label: const Text('Retry'),
              ),
            ],
          ),
        ),
      );
    }

    if (dailyTasks.isEmpty && !loadingDaily) {
      return ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        children: [
          SizedBox(height: MediaQuery.of(context).size.height * 0.18),
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.assignment_turned_in_outlined, size: 64, color: Colors.grey.shade400),
                const SizedBox(height: 16),
                Text(
                  'No daily tasks found',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.grey.shade700),
                ),
                const SizedBox(height: 6),
                Text(
                  'Tap the "+ Add Daily Task" button below to create one.',
                  style: TextStyle(fontSize: 13, color: Colors.grey.shade500),
                ),
                const SizedBox(height: 16),
                if (filterFrom != null || filterTo != null || filterStatus.isNotEmpty)
                  OutlinedButton.icon(
                    onPressed: _clearDailyFilters,
                    icon: const Icon(Icons.filter_alt_off_rounded, size: 16),
                    label: const Text('Clear Filters'),
                  ),
              ],
            ),
          ),
        ],
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(14, 12, 14, 80),
      physics: const AlwaysScrollableScrollPhysics(),
      itemCount: dailyTasks.length,
      separatorBuilder: (_, __) => const SizedBox(height: 10),
      itemBuilder: (context, index) {
        final task = dailyTasks[index];
        final title = task['task']?.toString() ?? 'Daily Task';
        final desc = task['description']?.toString() ?? '';
        final status = task['status']?.toString() ?? 'Pending';
        final subDate = _formatDisplayDate(task['submission_date']?.toString());
        final manager = task['manager']?.toString();

        return Card(
          elevation: 1,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
            side: BorderSide(color: Colors.grey.shade200),
          ),
          child: InkWell(
            borderRadius: BorderRadius.circular(12),
            onTap: () => viewTaskDetails(task),
            child: Padding(
              padding: const EdgeInsets.all(14.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title + Status
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Icon(_getStatusIcon(status), color: _getStatusColor(status), size: 22),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          title,
                          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: _getStatusBgColor(status),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: _getStatusColor(status).withValues(alpha: 0.3)),
                        ),
                        child: Text(
                          status,
                          style: TextStyle(
                            color: _getStatusColor(status),
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),

                  if (desc.isNotEmpty) ...[
                    const SizedBox(height: 8),
                    Text(
                      desc,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(color: Colors.grey.shade700, fontSize: 13, height: 1.3),
                    ),
                  ],

                  const SizedBox(height: 10),
                  Divider(color: Colors.grey.shade100, height: 1),
                  const SizedBox(height: 10),

                  // Date and Actions
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Icon(Icons.calendar_today_rounded, size: 14, color: Colors.grey.shade500),
                          const SizedBox(width: 6),
                          Text(
                            subDate,
                            style: TextStyle(fontSize: 12, color: Colors.grey.shade700, fontWeight: FontWeight.w500),
                          ),
                          if (manager != null && manager.isNotEmpty) ...[
                            const SizedBox(width: 10),
                            Text('•', style: TextStyle(color: Colors.grey.shade400)),
                            const SizedBox(width: 10),
                            Icon(Icons.supervisor_account_outlined, size: 14, color: Colors.grey.shade500),
                            const SizedBox(width: 4),
                            Text(
                              manager,
                              style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                            ),
                          ],
                        ],
                      ),
                      Row(
                        children: [
                          IconButton(
                            icon: const Icon(Icons.edit_outlined, size: 18, color: Colors.blueAccent),
                            tooltip: 'Edit',
                            constraints: const BoxConstraints(),
                            padding: const EdgeInsets.all(4),
                            onPressed: () => openDailyTaskForm(task),
                          ),
                          const SizedBox(width: 10),
                          IconButton(
                            icon: const Icon(Icons.delete_outline_rounded, size: 18, color: Colors.redAccent),
                            tooltip: 'Delete',
                            constraints: const BoxConstraints(),
                            padding: const EdgeInsets.all(4),
                            onPressed: () => confirmDeleteTask(task),
                          ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  // ==========================================
  // TAB 2: ASSIGNED TASKS (TASK BOARD)
  // ==========================================

  Widget _buildAssignedTasksTab() {
    if (loadingAssigned) {
      return const Center(child: CircularProgressIndicator());
    }

    if (errorAssigned != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.error_outline_rounded, size: 50, color: Colors.red.shade400),
              const SizedBox(height: 12),
              Text(
                'Could not load assigned tasks',
                style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: Colors.grey.shade800),
              ),
              const SizedBox(height: 6),
              Text(
                errorAssigned!,
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 13, color: Colors.grey.shade600),
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: fetchAssignedTasks,
                icon: const Icon(Icons.refresh_rounded),
                label: const Text('Retry'),
              ),
            ],
          ),
        ),
      );
    }

    if (assignedTasks.isEmpty) {
      return ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        children: [
          SizedBox(height: MediaQuery.of(context).size.height * 0.2),
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.assignment_late_outlined, size: 60, color: Colors.grey.shade400),
                const SizedBox(height: 16),
                Text(
                  'No Assigned Tasks',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.grey.shade700),
                ),
                const SizedBox(height: 6),
                Text(
                  'You currently have no tasks assigned by supervisors.',
                  style: TextStyle(fontSize: 13, color: Colors.grey.shade500),
                ),
              ],
            ),
          ),
        ],
      );
    }

    return RefreshIndicator(
      onRefresh: fetchAssignedTasks,
      child: ListView.builder(
        padding: const EdgeInsets.all(16.0),
        physics: const AlwaysScrollableScrollPhysics(),
        itemCount: assignedTasks.length,
        itemBuilder: (context, index) {
          final task = assignedTasks[index];
          final status = task['status']?.toString() ?? 'Pending';
          final subDate = _formatDisplayDate(task['submission_date']?.toString());

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
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Icon(_getStatusIcon(status), color: _getStatusColor(status), size: 24),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          task['task']?.toString() ?? 'General Task',
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: _getStatusBgColor(status),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: _getStatusColor(status).withValues(alpha: 0.3)),
                        ),
                        child: Text(
                          status,
                          style: TextStyle(
                            color: _getStatusColor(status),
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    task['description'] ?? 'No description provided.',
                    style: TextStyle(
                      color: Colors.grey.shade700,
                      fontSize: 13,
                      height: 1.4,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Divider(color: Colors.grey.shade100, height: 1),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Icon(Icons.calendar_month_outlined, size: 14, color: Colors.grey.shade500),
                      const SizedBox(width: 6),
                      Text(
                        "Due Date: ",
                        style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                      ),
                      Text(
                        subDate,
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: Colors.grey.shade800,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

class _DailyTaskFormSheet extends StatefulWidget {
  final Map<String, dynamic>? existing;
  final String Function(DioException, String) extractDioError;

  const _DailyTaskFormSheet({
    this.existing,
    required this.extractDioError,
  });

  @override
  State<_DailyTaskFormSheet> createState() => _DailyTaskFormSheetState();
}

class _DailyTaskFormSheetState extends State<_DailyTaskFormSheet> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _titleCtrl;
  late TextEditingController _descCtrl;
  late TextEditingController _managerCtrl;
  late DateTime _selectedDate;
  late String _selectedStatus;
  bool _isSaving = false;

  final DateFormat _apiDateFormat = DateFormat('yyyy-MM-dd');
  String _formatApiDate(DateTime value) => _apiDateFormat.format(value);

  @override
  void initState() {
    super.initState();
    _titleCtrl = TextEditingController(text: widget.existing?['task']?.toString() ?? '');
    _descCtrl = TextEditingController(text: widget.existing?['description']?.toString() ?? '');
    _managerCtrl = TextEditingController(text: widget.existing?['manager']?.toString() ?? '');
    _selectedDate = DateTime.tryParse(widget.existing?['submission_date']?.toString() ?? '') ?? DateTime.now();
    _selectedStatus = widget.existing?['status']?.toString() ?? 'Pending';
  }

  @override
  void dispose() {
    _titleCtrl.dispose();
    _descCtrl.dispose();
    _managerCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isSaving = true);
    try {
      final prefs = await SharedPreferences.getInstance();
      final uname = prefs.getString('username');
      final payload = <String, dynamic>{
        if (uname != null && uname.isNotEmpty) 'username': uname,
        'task': _titleCtrl.text.trim(),
        'description': _descCtrl.text.trim(),
        'manager': _managerCtrl.text.trim(),
        'submission_date': _formatApiDate(_selectedDate),
        'status': _selectedStatus,
      };

      if (widget.existing == null) {
        await ApiClient.client.post('${AppConstants.apiLink}daily-tasks', data: payload);
      } else {
        await ApiClient.client.put(
          '${AppConstants.apiLink}daily-tasks/${widget.existing!['id']}',
          data: payload,
        );
      }

      if (mounted) {
        Navigator.of(context).pop(true);
      }
    } on DioException catch (e) {
      if (mounted) {
        setState(() => _isSaving = false);
        final msg = widget.extractDioError(e, 'Could not save task.');
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(msg), backgroundColor: Colors.red.shade700),
        );
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isSaving = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: ${e.toString()}'), backgroundColor: Colors.red.shade700),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      padding: EdgeInsets.only(
        left: 20,
        right: 20,
        top: 20,
        bottom: MediaQuery.of(context).viewInsets.bottom + 20,
      ),
      child: SingleChildScrollView(
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    widget.existing == null ? 'New Daily Task' : 'Edit Daily Task',
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded),
                    onPressed: () => Navigator.pop(context, false),
                  ),
                ],
              ),
              const Divider(),
              const SizedBox(height: 10),

              // Task Title
              TextFormField(
                controller: _titleCtrl,
                decoration: InputDecoration(
                  labelText: 'Task Title *',
                  hintText: 'What did you work on today?',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                  prefixIcon: const Icon(Icons.task_alt_rounded),
                ),
                maxLength: 2000,
                validator: (val) => val == null || val.trim().isEmpty ? 'Task title is required.' : null,
              ),
              const SizedBox(height: 12),

              // Description
              TextFormField(
                controller: _descCtrl,
                decoration: InputDecoration(
                  labelText: 'Description / Details',
                  hintText: 'Enter accomplishments, progress, or blockers...',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                  prefixIcon: const Icon(Icons.notes_rounded),
                ),
                maxLines: 3,
              ),
              const SizedBox(height: 12),

              // Supervisor / Manager
              TextFormField(
                controller: _managerCtrl,
                decoration: InputDecoration(
                  labelText: 'Supervisor / Manager (Optional)',
                  hintText: 'Supervisor name',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                  prefixIcon: const Icon(Icons.supervisor_account_outlined),
                ),
              ),
              const SizedBox(height: 12),

              // Date Picker Tile & Status Row
              Row(
                children: [
                  // Date Selector
                  Expanded(
                    child: InkWell(
                      onTap: () async {
                        final picked = await showDatePicker(
                          context: context,
                          initialDate: _selectedDate,
                          firstDate: DateTime(2020),
                          lastDate: DateTime(2035),
                        );
                        if (picked != null) {
                          setState(() => _selectedDate = picked);
                        }
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                        decoration: BoxDecoration(
                          border: Border.all(color: Colors.grey.shade400),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.calendar_today_rounded, size: 18, color: Colors.blueAccent),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('Date', style: TextStyle(fontSize: 11, color: Colors.grey.shade600)),
                                  Text(_formatApiDate(_selectedDate), style: const TextStyle(fontWeight: FontWeight.w600)),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),

                  // Status Dropdown
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                      decoration: BoxDecoration(
                        border: Border.all(color: Colors.grey.shade400),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: DropdownButtonHideUnderline(
                        child: DropdownButton<String>(
                          value: _selectedStatus,
                          isExpanded: true,
                          items: ['Pending', 'In Progress', 'Completed']
                              .map((val) => DropdownMenuItem(
                                    value: val,
                                    child: Text(val, style: const TextStyle(fontSize: 13)),
                                  ))
                              .toList(),
                          onChanged: (val) {
                            if (val != null) setState(() => _selectedStatus = val);
                          },
                        ),
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 24),

              // Submit Button
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton.icon(
                  icon: _isSaving
                      ? const SizedBox(
                          width: 18,
                          height: 18,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                        )
                      : const Icon(Icons.save_rounded),
                  label: Text(
                    _isSaving ? 'Saving...' : (widget.existing == null ? 'Create Task' : 'Update Task'),
                    style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                  ),
                  style: ElevatedButton.styleFrom(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                  onPressed: _isSaving ? null : _submit,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
