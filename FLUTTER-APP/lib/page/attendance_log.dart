import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../common/api_client.dart';
import '../constants.dart';

class AttendanceLogPage extends StatefulWidget {
  const AttendanceLogPage({super.key});

  @override
  State<AttendanceLogPage> createState() => _AttendanceLogPageState();
}

class _AttendanceLogPageState extends State<AttendanceLogPage> {
  DateTime? from = DateTime(DateTime.now().year, DateTime.now().month, 1);
  DateTime? to = DateTime(DateTime.now().year, DateTime.now().month + 1, 0);
  String status = '';
  int page = 1;
  int lastPage = 1;
  bool loading = false;
  String? error;
  List<Map<String, dynamic>> rows = [];

  String date(DateTime value) => DateFormat('yyyy-MM-dd').format(value);

  @override
  void initState() {
    super.initState();
    load();
  }

  Future<void> load() async {
    setState(() { loading = true; error = null; });
    try {
      final response = await ApiClient.client.get('${AppConstants.apiLink}attendance/log/filter', queryParameters: {
        'page': page, 'per_page': 20,
        if (from != null) 'from': date(from!),
        if (to != null) 'to': date(to!),
        if (status.isNotEmpty) 'status': status,
      });
      if (mounted) setState(() {
        rows = (response.data['data'] as List).map((row) => Map<String, dynamic>.from(row)).toList();
        lastPage = response.data['last_page'] ?? 1;
      });
    } on DioException catch (e) {
      if (mounted) setState(() => error = e.response?.data is Map ? e.response?.data['detail']?.toString() ?? 'Could not load attendance.' : 'Could not load attendance.');
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  Future<void> pickDate(bool start) async {
    final picked = await showDatePicker(context: context, initialDate: DateTime.now(),
      firstDate: DateTime(2020), lastDate: DateTime(2100));
    if (picked == null) return;
    setState(() { if (start) { from = picked; } else { to = picked; } page = 1; });
    load();
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Text('Attendance log')),
    body: Column(children: [
      Wrap(spacing: 8, children: [
        TextButton(onPressed: () => pickDate(true), child: Text(from == null ? 'From date' : 'From ${date(from!)}')),
        TextButton(onPressed: () => pickDate(false), child: Text(to == null ? 'To date' : 'To ${date(to!)}')),
        DropdownButton<String>(value: status, items: ['', 'Present', 'Absent', 'Half Day', 'Holiday', 'Web']
          .map((value) => DropdownMenuItem(value: value, child: Text(value.isEmpty ? 'All statuses' : value))).toList(),
          onChanged: (value) { setState(() { status = value ?? ''; page = 1; }); load(); }),
        TextButton(onPressed: () { setState(() { from = null; to = null; status = ''; page = 1; }); load(); }, child: const Text('Clear')),
      ]),
      if (loading) const LinearProgressIndicator(),
      if (error != null) Text(error!),
      Expanded(child: rows.isEmpty && !loading ? const Center(child: Text('No attendance records found.')) : ListView.builder(
        itemCount: rows.length, itemBuilder: (context, index) {
          final row = rows[index];
          return ListTile(title: Text('${row['attendance_date'] ?? row['login_date'] ?? ''} • ${row['attendance'] ?? ''}'),
            subtitle: Text('In: ${row['login_at'] ?? '—'}   Out: ${row['logout_at'] ?? '—'}'));
        })),
      Row(mainAxisAlignment: MainAxisAlignment.center, children: [
        IconButton(onPressed: page > 1 ? () { setState(() => page--); load(); } : null, icon: const Icon(Icons.chevron_left)),
        Text('$page of $lastPage'),
        IconButton(onPressed: page < lastPage ? () { setState(() => page++); load(); } : null, icon: const Icon(Icons.chevron_right)),
      ]),
    ]),
  );
}
