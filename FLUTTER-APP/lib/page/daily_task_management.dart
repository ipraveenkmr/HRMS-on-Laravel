import 'dart:io';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:path_provider/path_provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../common/api_client.dart';
import '../constants.dart';

class DailyTaskManagementPage extends StatefulWidget {
  const DailyTaskManagementPage({super.key});

  @override
  State<DailyTaskManagementPage> createState() => _DailyTaskManagementPageState();
}

class _DailyTaskManagementPageState extends State<DailyTaskManagementPage> {
  List<Map<String, dynamic>> tasks = [];
  DateTime? from;
  DateTime? to;
  String status = '';
  String period = 'weekly';
  DateTime reportDate = DateTime.now();
  bool loading = false;
  String? error;
  final base = '${AppConstants.apiLink}daily-tasks';

  final DateFormat _apiDateFormat = DateFormat('yyyy-MM-dd');
  final DateFormat _displayDateFormat = DateFormat('EEE, dd MMM yyyy');

  String date(DateTime value) => _apiDateFormat.format(value);

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
    refresh();
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

  Future<void> refresh() async {
    setState(() {
      loading = true;
      error = null;
    });
    try {
      final prefs = await SharedPreferences.getInstance();
      final uname = prefs.getString('username');

      final response = await ApiClient.client.get(base, queryParameters: {
        if (uname != null && uname.isNotEmpty) 'username': uname,
        if (from != null) 'from': date(from!),
        if (to != null) 'to': date(to!),
        if (status.isNotEmpty) 'status': status,
      });
      if (mounted && response.data is List) {
        final list = (response.data as List).map((item) => Map<String, dynamic>.from(item)).toList();
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
        setState(() => tasks = list);
      }
    } on DioException catch (e) {
      if (mounted) setState(() => error = _extractDioError(e, 'Could not load tasks.'));
    } catch (e) {
      if (mounted) setState(() => error = 'Error: ${e.toString()}');
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  Future<void> editTask([Map<String, dynamic>? existing]) async {
    final title = TextEditingController(text: existing?['task']?.toString() ?? '');
    final description = TextEditingController(text: existing?['description']?.toString() ?? '');
    DateTime selectedDate = DateTime.tryParse(existing?['submission_date']?.toString() ?? '') ?? DateTime.now();
    String selectedStatus = existing?['status']?.toString() ?? 'Pending';
    final formKey = GlobalKey<FormState>();

    final saved = await showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (bottomSheetContext) => StatefulBuilder(
        builder: (context, update) => Container(
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
              key: formKey,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        existing == null ? 'Add Daily Task' : 'Edit Daily Task',
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close_rounded),
                        onPressed: () => Navigator.pop(bottomSheetContext, false),
                      ),
                    ],
                  ),
                  const Divider(),
                  const SizedBox(height: 10),
                  TextFormField(
                    controller: title,
                    decoration: InputDecoration(
                      labelText: 'Task Title *',
                      hintText: 'Enter task summary',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                      prefixIcon: const Icon(Icons.task_alt_rounded),
                    ),
                    maxLength: 2000,
                    validator: (value) => value == null || value.trim().isEmpty ? 'Enter a task title.' : null,
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: description,
                    decoration: InputDecoration(
                      labelText: 'Description',
                      hintText: 'Enter task details',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                      prefixIcon: const Icon(Icons.notes_rounded),
                    ),
                    maxLines: 3,
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: InkWell(
                          onTap: () async {
                            final picked = await showDatePicker(
                              context: context,
                              initialDate: selectedDate,
                              firstDate: DateTime(2020),
                              lastDate: DateTime(2035),
                            );
                            if (picked != null) update(() => selectedDate = picked);
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
                                      Text(date(selectedDate), style: const TextStyle(fontWeight: FontWeight.w600)),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                          decoration: BoxDecoration(
                            border: Border.all(color: Colors.grey.shade400),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: DropdownButtonHideUnderline(
                            child: DropdownButton<String>(
                              value: selectedStatus,
                              isExpanded: true,
                              items: ['Pending', 'In Progress', 'Completed']
                                  .map((val) => DropdownMenuItem(value: val, child: Text(val, style: const TextStyle(fontSize: 13))))
                                  .toList(),
                              onChanged: (val) {
                                if (val != null) update(() => selectedStatus = val);
                              },
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: ElevatedButton.icon(
                      icon: const Icon(Icons.save_rounded),
                      label: Text(existing == null ? 'Create Task' : 'Update Task', style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                      style: ElevatedButton.styleFrom(shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10))),
                      onPressed: () async {
                        if (!formKey.currentState!.validate()) return;
                        final messenger = ScaffoldMessenger.of(this.context);
                        try {
                          final prefs = await SharedPreferences.getInstance();
                          final uname = prefs.getString('username');
                          final Map<String, dynamic> payload = {
                            if (uname != null && uname.isNotEmpty) 'username': uname,
                            'task': title.text.trim(),
                            'description': description.text.trim(),
                            'submission_date': date(selectedDate),
                            'status': selectedStatus,
                          };
                          if (existing == null) {
                            await ApiClient.client.post(base, data: payload);
                          } else {
                            await ApiClient.client.put('$base/${existing['id']}', data: payload);
                          }
                          if (bottomSheetContext.mounted) {
                            Navigator.of(bottomSheetContext).pop(true);
                          }
                        } on DioException catch (e) {
                          final msg = _extractDioError(e, 'Could not save task.');
                          if (bottomSheetContext.mounted) {
                            ScaffoldMessenger.of(bottomSheetContext).showSnackBar(SnackBar(content: Text(msg), backgroundColor: Colors.red.shade700));
                          }
                        }
                      },
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );

    title.dispose();
    description.dispose();
    if (saved == true) {
      await refresh();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Text(existing == null ? 'Task created!' : 'Task updated!'),
          backgroundColor: Colors.green.shade700,
        ));
      }
    }
  }

  Future<void> deleteTask(Map<String, dynamic> task) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Daily Task?'),
        content: Text("Are you sure you want to delete '${task['task']}'?"),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: Colors.red.shade600),
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
    if (confirmed != true) return;
    try {
      await ApiClient.client.delete('$base/${task['id']}');
      refresh();
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Task deleted.')));
    } on DioException catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(_extractDioError(e, 'Could not delete task.')), backgroundColor: Colors.red.shade700));
    }
  }

  Future<void> download(String format) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final uname = prefs.getString('username');
      final response = await ApiClient.client.get(
        '$base/report/download',
        queryParameters: {
          if (uname != null && uname.isNotEmpty) 'username': uname,
          'period': period,
          'date': date(reportDate),
          'format': format,
          if (status.isNotEmpty) 'status': status,
        },
        options: Options(responseType: ResponseType.bytes),
      );
      final directory = await getDownloadsDirectory() ?? await getApplicationDocumentsDirectory();
      final file = File('${directory.path}/daily-tasks-$period-${date(reportDate)}.$format');
      await file.writeAsBytes(List<int>.from(response.data));
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Saved report: ${file.path}'),
            backgroundColor: Colors.green.shade700,
          ),
        );
      }
    } on DioException catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(_extractDioError(e, 'Could not download report.')), backgroundColor: Colors.red.shade700));
    }
  }

  Future<void> pickFilterDateRange() async {
    final picked = await showDateRangePicker(
      context: context,
      firstDate: DateTime(2020),
      lastDate: DateTime(2035),
      initialDateRange: (from != null && to != null)
          ? DateTimeRange(start: from!, end: to!)
          : DateTimeRange(start: DateTime.now().subtract(const Duration(days: 30)), end: DateTime.now()),
    );
    if (picked != null) {
      setState(() {
        from = picked.start;
        to = picked.end;
      });
      refresh();
    }
  }

  Color _getStatusColor(String? statusText) {
    switch ((statusText ?? '').toLowerCase()) {
      case 'completed':
        return Colors.green.shade700;
      case 'in progress':
        return Colors.blue.shade700;
      case 'pending':
      default:
        return Colors.orange.shade800;
    }
  }

  Color _getStatusBgColor(String? statusText) {
    switch ((statusText ?? '').toLowerCase()) {
      case 'completed':
        return Colors.green.shade50;
      case 'in progress':
        return Colors.blue.shade50;
      case 'pending':
      default:
        return Colors.orange.shade50;
    }
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: Colors.grey.shade100,
    appBar: AppBar(
      title: const Text('Daily Tasks', style: TextStyle(fontWeight: FontWeight.bold)),
      elevation: 0,
      actions: [
        IconButton(icon: const Icon(Icons.refresh_rounded), tooltip: 'Refresh', onPressed: refresh),
      ],
    ),
    floatingActionButton: FloatingActionButton.extended(
      onPressed: () => editTask(),
      icon: const Icon(Icons.add_rounded),
      label: const Text('Add Task', style: TextStyle(fontWeight: FontWeight.bold)),
    ),
    body: Column(
      children: [
        // Filter Controls
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
            children: [
              Row(
                children: [
                  Expanded(
                    flex: 3,
                    child: OutlinedButton.icon(
                      onPressed: pickFilterDateRange,
                      icon: const Icon(Icons.date_range_rounded, size: 18),
                      label: Text(
                        (from != null && to != null)
                            ? '${DateFormat('dd MMM').format(from!)} - ${DateFormat('dd MMM').format(to!)}'
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
                          value: status,
                          isExpanded: true,
                          items: const [
                            DropdownMenuItem(value: '', child: Text('All', style: TextStyle(fontSize: 13))),
                            DropdownMenuItem(value: 'Pending', child: Text('Pending', style: TextStyle(fontSize: 13))),
                            DropdownMenuItem(value: 'In Progress', child: Text('In Progress', style: TextStyle(fontSize: 13))),
                            DropdownMenuItem(value: 'Completed', child: Text('Completed', style: TextStyle(fontSize: 13))),
                          ],
                          onChanged: (val) {
                            setState(() => status = val ?? '');
                            refresh();
                          },
                        ),
                      ),
                    ),
                  ),
                  if (from != null || to != null || status.isNotEmpty) ...[
                    const SizedBox(width: 6),
                    IconButton(
                      onPressed: () {
                        setState(() {
                          from = null;
                          to = null;
                          status = '';
                        });
                        refresh();
                      },
                      icon: const Icon(Icons.clear_rounded, color: Colors.redAccent),
                      tooltip: 'Clear',
                    ),
                  ],
                ],
              ),
              const SizedBox(height: 8),
              // Download reports row
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8),
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.grey.shade300),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: DropdownButtonHideUnderline(
                      child: DropdownButton<String>(
                        value: period,
                        items: const [
                          DropdownMenuItem(value: 'weekly', child: Text('Weekly', style: TextStyle(fontSize: 12))),
                          DropdownMenuItem(value: 'monthly', child: Text('Monthly', style: TextStyle(fontSize: 12))),
                        ],
                        onChanged: (val) => setState(() => period = val ?? 'weekly'),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      onPressed: () async {
                        final picked = await showDatePicker(
                          context: context,
                          initialDate: reportDate,
                          firstDate: DateTime(2020),
                          lastDate: DateTime(2035),
                        );
                        if (picked != null) setState(() => reportDate = picked);
                      },
                      child: Text(date(reportDate), style: const TextStyle(fontSize: 12)),
                    ),
                  ),
                  const SizedBox(width: 6),
                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                      backgroundColor: Colors.green.shade700,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    onPressed: () => download('csv'),
                    icon: const Icon(Icons.table_chart_rounded, size: 16),
                    label: const Text('CSV', style: TextStyle(fontSize: 12)),
                  ),
                  const SizedBox(width: 6),
                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                      backgroundColor: Colors.red.shade700,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    onPressed: () => download('pdf'),
                    icon: const Icon(Icons.picture_as_pdf_rounded, size: 16),
                    label: const Text('PDF', style: TextStyle(fontSize: 12)),
                  ),
                ],
              ),
            ],
          ),
        ),

        if (loading) const LinearProgressIndicator(minHeight: 2),

        if (error != null)
          Padding(
            padding: const EdgeInsets.all(12),
            child: Text(error!, style: TextStyle(color: Colors.red.shade700)),
          ),

        Expanded(
          child: tasks.isEmpty && !loading
              ? const Center(child: Text('No daily tasks found.'))
              : ListView.separated(
                  padding: const EdgeInsets.fromLTRB(14, 12, 14, 80),
                  itemCount: tasks.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 10),
                  itemBuilder: (context, index) {
                    final task = tasks[index];
                    final statusVal = task['status']?.toString() ?? 'Pending';
                    return Card(
                      elevation: 1,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                        side: BorderSide(color: Colors.grey.shade200),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(14.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Expanded(
                                  child: Text(
                                    task['task']?.toString() ?? '',
                                    style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: _getStatusBgColor(statusVal),
                                    borderRadius: BorderRadius.circular(8),
                                    border: Border.all(color: _getStatusColor(statusVal).withValues(alpha: 0.3)),
                                  ),
                                  child: Text(
                                    statusVal,
                                    style: TextStyle(
                                      color: _getStatusColor(statusVal),
                                      fontSize: 11,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            if (task['description'] != null && task['description'].toString().isNotEmpty) ...[
                              const SizedBox(height: 6),
                              Text(
                                task['description'].toString(),
                                style: TextStyle(color: Colors.grey.shade700, fontSize: 13),
                              ),
                            ],
                            const SizedBox(height: 10),
                            Divider(color: Colors.grey.shade100, height: 1),
                            const SizedBox(height: 10),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  _formatDisplayDate(task['submission_date']?.toString()),
                                  style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                                ),
                                Row(
                                  children: [
                                    IconButton(
                                      tooltip: 'Edit task',
                                      icon: const Icon(Icons.edit_outlined, size: 18, color: Colors.blueAccent),
                                      onPressed: () => editTask(task),
                                    ),
                                    IconButton(
                                      tooltip: 'Delete task',
                                      icon: const Icon(Icons.delete_outline_rounded, size: 18, color: Colors.redAccent),
                                      onPressed: () => deleteTask(task),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
        ),
      ],
    ),
  );
}
