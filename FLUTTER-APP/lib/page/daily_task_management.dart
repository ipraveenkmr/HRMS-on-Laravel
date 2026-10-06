import 'dart:io';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:path_provider/path_provider.dart';
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

  @override
  void initState() {
    super.initState();
    refresh();
  }

  String date(DateTime value) => DateFormat('yyyy-MM-dd').format(value);

  Future<void> refresh() async {
    setState(() { loading = true; error = null; });
    try {
      final response = await ApiClient.client.get(base, queryParameters: {
        if (from != null) 'from': date(from!),
        if (to != null) 'to': date(to!),
        if (status.isNotEmpty) 'status': status,
      });
      if (mounted) setState(() => tasks = (response.data as List).map((item) => Map<String, dynamic>.from(item)).toList());
    } on DioException catch (e) {
      if (mounted) setState(() => error = e.response?.data is Map ? e.response?.data['detail']?.toString() ?? 'Could not load tasks.' : 'Could not load tasks.');
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
    final saved = await showDialog<bool>(context: context, builder: (dialogContext) => StatefulBuilder(
      builder: (context, update) => AlertDialog(
        title: Text(existing == null ? 'Add daily task' : 'Edit daily task'),
        content: SingleChildScrollView(child: Form(key: formKey, child: Column(mainAxisSize: MainAxisSize.min, children: [
          TextFormField(controller: title, decoration: const InputDecoration(labelText: 'Task'), maxLength: 2000,
            validator: (value) => value == null || value.trim().isEmpty ? 'Enter a task.' : null),
          TextFormField(controller: description, decoration: const InputDecoration(labelText: 'Description'), maxLines: 3),
          ListTile(title: Text('Date: ${date(selectedDate)}'), trailing: const Icon(Icons.calendar_today), onTap: () async {
            final picked = await showDatePicker(context: context, initialDate: selectedDate,
              firstDate: DateTime(2020), lastDate: DateTime(2100));
            if (picked != null) update(() => selectedDate = picked);
          }),
          DropdownButtonFormField<String>(value: selectedStatus, decoration: const InputDecoration(labelText: 'Status'),
            items: ['Pending', 'In Progress', 'Completed'].map((value) => DropdownMenuItem(value: value, child: Text(value))).toList(),
            onChanged: (value) => update(() => selectedStatus = value ?? 'Pending')),
        ]))),
        actions: [
          TextButton(onPressed: () => Navigator.pop(dialogContext, false), child: const Text('Cancel')),
          FilledButton(onPressed: () async {
            if (!formKey.currentState!.validate()) return;
            try {
              final Map<String, dynamic> payload = {'task': title.text.trim(), 'description': description.text.trim(),
                'submission_date': date(selectedDate), 'status': selectedStatus};
              if (existing == null) {
                final profile = await ApiClient.client.get('${AppConstants.apiLink}auth/me');
                payload['employee_id'] = profile.data['employee_id'];
                payload['department_id'] = profile.data['department_id'];
                await ApiClient.client.post(base, data: payload);
              } else {
                await ApiClient.client.put('$base/${existing['id']}', data: payload);
              }
              if (dialogContext.mounted) Navigator.pop(dialogContext, true);
            } on DioException catch (e) {
              final detail = e.response?.data is Map ? e.response?.data['detail'] ?? e.response?.data['message'] : null;
              if (mounted) ScaffoldMessenger.of(this.context).showSnackBar(SnackBar(content: Text(detail?.toString() ?? 'Could not save task.')));
            }
          }, child: const Text('Save')),
        ],
      ),
    ));
    title.dispose();
    description.dispose();
    if (saved == true) refresh();
  }

  Future<void> deleteTask(Map<String, dynamic> task) async {
    final confirmed = await showDialog<bool>(context: context, builder: (context) => AlertDialog(
      title: const Text('Delete task?'), actions: [
        TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
        TextButton(onPressed: () => Navigator.pop(context, true), child: const Text('Delete')),
      ]));
    if (confirmed != true) return;
    try { await ApiClient.client.delete('$base/${task['id']}'); refresh(); }
    on DioException catch (_) { if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Could not delete task.'))); }
  }

  Future<void> download(String format) async {
    try {
      final response = await ApiClient.client.get('$base/report/download',
        queryParameters: {'period': period, 'date': date(reportDate), 'format': format,
          if (status.isNotEmpty) 'status': status},
        options: Options(responseType: ResponseType.bytes));
      final directory = await getDownloadsDirectory() ?? await getApplicationDocumentsDirectory();
      final file = File('${directory.path}/daily-tasks-$period-${date(reportDate)}.$format');
      await file.writeAsBytes(List<int>.from(response.data));
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Saved report: ${file.path}')));
    } on DioException catch (_) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Could not download report.')));
    }
  }

  Future<void> pickDate(bool isFrom) async {
    final picked = await showDatePicker(context: context, initialDate: DateTime.now(),
      firstDate: DateTime(2020), lastDate: DateTime(2100));
    if (picked != null) { setState(() { if (isFrom) from = picked; else to = picked; }); refresh(); }
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Text('Daily tasks')),
    floatingActionButton: FloatingActionButton(onPressed: () => editTask(), child: const Icon(Icons.add)),
    body: Column(children: [
      Wrap(spacing: 8, children: [
        TextButton(onPressed: () => pickDate(true), child: Text(from == null ? 'From date' : 'From ${date(from!)}')),
        TextButton(onPressed: () => pickDate(false), child: Text(to == null ? 'To date' : 'To ${date(to!)}')),
        DropdownButton<String>(value: status, items: ['', 'Pending', 'In Progress', 'Completed']
          .map((value) => DropdownMenuItem(value: value, child: Text(value.isEmpty ? 'All statuses' : value))).toList(),
          onChanged: (value) { setState(() => status = value ?? ''); refresh(); }),
        TextButton(onPressed: () { setState(() { from = null; to = null; status = ''; }); refresh(); }, child: const Text('Clear')),
      ]),
      Wrap(spacing: 8, children: [
        DropdownButton<String>(value: period, items: ['weekly', 'monthly'].map((value) => DropdownMenuItem(value: value, child: Text(value))).toList(),
          onChanged: (value) => setState(() => period = value ?? 'weekly')),
        TextButton(onPressed: () async { final picked = await showDatePicker(context: context, initialDate: reportDate,
          firstDate: DateTime(2020), lastDate: DateTime(2100)); if (picked != null) setState(() => reportDate = picked); },
          child: Text(date(reportDate))),
        OutlinedButton(onPressed: () => download('csv'), child: const Text('CSV')),
        OutlinedButton(onPressed: () => download('pdf'), child: const Text('PDF')),
      ]),
      if (loading) const LinearProgressIndicator(),
      if (error != null) Text(error!),
      Expanded(child: tasks.isEmpty && !loading ? const Center(child: Text('No tasks found.')) : ListView.builder(
        itemCount: tasks.length, itemBuilder: (context, index) {
          final task = tasks[index];
          return ListTile(title: Text(task['task']?.toString() ?? ''),
            subtitle: Text('${task['submission_date'] ?? ''} • ${task['status'] ?? 'Pending'}\n${task['description'] ?? ''}'),
            isThreeLine: true,
            trailing: Wrap(children: [
              IconButton(tooltip: 'Edit task', icon: const Icon(Icons.edit), onPressed: () => editTask(task)),
              IconButton(tooltip: 'Delete task', icon: const Icon(Icons.delete), onPressed: () => deleteTask(task)),
            ]));
        })),
    ]),
  );
}
