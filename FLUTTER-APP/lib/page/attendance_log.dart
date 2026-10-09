import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../common/api_client.dart';
import '../constants.dart';

class AttendanceLogPage extends StatefulWidget {
  const AttendanceLogPage({super.key});

  @override
  State<AttendanceLogPage> createState() => _AttendanceLogPageState();
}

class _AttendanceLogPageState extends State<AttendanceLogPage> {
  DateTime? from;
  DateTime? to;
  String status = '';
  int page = 1;
  int lastPage = 1;
  int totalRecords = 0;
  bool loading = false;
  String? error;
  List<Map<String, dynamic>> rows = [];

  final DateFormat _apiDateFormat = DateFormat('yyyy-MM-dd');
  final DateFormat _displayDateFormat = DateFormat('EEE, dd MMM yyyy');

  @override
  void initState() {
    super.initState();
    load();
  }

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

  String _extractError(DioException e) {
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
    if (e.response?.statusCode == 401) return 'Session expired. Please log in again.';
    if (e.response?.statusCode == 403) return 'Access denied to attendance logs.';
    if (e.type == DioExceptionType.connectionError || e.type == DioExceptionType.connectionTimeout) {
      return 'Could not connect to backend server.';
    }
    return 'Could not load attendance logs. Please try again.';
  }

  Future<void> load() async {
    setState(() {
      loading = true;
      error = null;
    });

    try {
      final prefs = await SharedPreferences.getInstance();
      final uname = prefs.getString('username');

      final query = <String, dynamic>{
        'page': page,
        'per_page': 15,
        if (uname != null && uname.isNotEmpty) 'username': uname,
        if (from != null) 'from': _formatApiDate(from!),
        if (to != null) 'to': _formatApiDate(to!),
        if (status.isNotEmpty) 'status': status,
      };

      final response = await ApiClient.client.get(
        '${AppConstants.apiLink}attendance/log/filter',
        queryParameters: query,
      );

      if (mounted) {
        final responseData = response.data;
        if (responseData is Map && responseData['data'] is List) {
          setState(() {
            rows = (responseData['data'] as List)
                .map((row) => Map<String, dynamic>.from(row))
                .toList();
            lastPage = responseData['last_page'] ?? 1;
            totalRecords = responseData['total'] ?? rows.length;
          });
        } else if (responseData is List) {
          setState(() {
            rows = responseData.map((row) => Map<String, dynamic>.from(row)).toList();
            lastPage = 1;
            totalRecords = rows.length;
          });
        }
      }
    } on DioException catch (e) {
      if (mounted) {
        setState(() {
          error = _extractError(e);
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          error = 'Unexpected error: ${e.toString()}';
        });
      }
    } finally {
      if (mounted) {
        setState(() {
          loading = false;
        });
      }
    }
  }

  Future<void> _pickDateRange() async {
    final now = DateTime.now();
    final picked = await showDateRangePicker(
      context: context,
      firstDate: DateTime(2020),
      lastDate: DateTime(2035),
      initialDateRange: (from != null && to != null)
          ? DateTimeRange(start: from!, end: to!)
          : DateTimeRange(start: now.subtract(const Duration(days: 30)), end: now),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: ColorScheme.light(
              primary: Theme.of(context).primaryColor,
              onPrimary: Colors.white,
            ),
          ),
          child: child!,
        );
      },
    );

    if (picked != null) {
      setState(() {
        from = picked.start;
        to = picked.end;
        page = 1;
      });
      load();
    }
  }

  void _clearFilters() {
    setState(() {
      from = null;
      to = null;
      status = '';
      page = 1;
    });
    load();
  }

  Color _getStatusColor(String? statusText) {
    switch ((statusText ?? '').toLowerCase()) {
      case 'present':
        return Colors.green.shade700;
      case 'absent':
        return Colors.red.shade700;
      case 'half day':
        return Colors.orange.shade800;
      case 'holiday':
        return Colors.purple.shade700;
      case 'leave':
        return Colors.blue.shade700;
      default:
        return Colors.grey.shade700;
    }
  }

  Color _getStatusBgColor(String? statusText) {
    switch ((statusText ?? '').toLowerCase()) {
      case 'present':
        return Colors.green.shade50;
      case 'absent':
        return Colors.red.shade50;
      case 'half day':
        return Colors.orange.shade50;
      case 'holiday':
        return Colors.purple.shade50;
      case 'leave':
        return Colors.blue.shade50;
      default:
        return Colors.grey.shade100;
    }
  }

  @override
  Widget build(BuildContext context) {
    final hasActiveFilter = from != null || to != null || status.isNotEmpty;

    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      appBar: AppBar(
        title: const Text(
          'Attendance Log',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            tooltip: 'Refresh',
            onPressed: loading ? null : load,
          ),
        ],
      ),
      body: Column(
        children: [
          // Filter Card Header
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
                    // Date range selector button
                    Expanded(
                      flex: 3,
                      child: OutlinedButton.icon(
                        onPressed: _pickDateRange,
                        icon: const Icon(Icons.date_range_rounded, size: 18),
                        label: Text(
                          (from != null && to != null)
                              ? (from!.year == to!.year
                                  ? '${DateFormat('dd MMM').format(from!)} - ${DateFormat('dd MMM yyyy').format(to!)}'
                                  : '${DateFormat('dd MMM yy').format(from!)} - ${DateFormat('dd MMM yy').format(to!)}')
                              : 'Select Date Range',
                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
                          overflow: TextOverflow.ellipsis,
                        ),
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
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
                            value: status,
                            isExpanded: true,
                            icon: const Icon(Icons.keyboard_arrow_down_rounded, size: 20),
                            items: const [
                              DropdownMenuItem(value: '', child: Text('All', style: TextStyle(fontSize: 13))),
                              DropdownMenuItem(value: 'Present', child: Text('Present', style: TextStyle(fontSize: 13))),
                              DropdownMenuItem(value: 'Absent', child: Text('Absent', style: TextStyle(fontSize: 13))),
                              DropdownMenuItem(value: 'Half Day', child: Text('Half Day', style: TextStyle(fontSize: 13))),
                              DropdownMenuItem(value: 'Holiday', child: Text('Holiday', style: TextStyle(fontSize: 13))),
                            ],
                            onChanged: (val) {
                              setState(() {
                                status = val ?? '';
                                page = 1;
                              });
                              load();
                            },
                          ),
                        ),
                      ),
                    ),

                    if (hasActiveFilter) ...[
                      const SizedBox(width: 6),
                      IconButton(
                        onPressed: _clearFilters,
                        icon: const Icon(Icons.clear_rounded, color: Colors.redAccent),
                        tooltip: 'Clear Filters',
                      ),
                    ],
                  ],
                ),
                if (totalRecords > 0)
                  Padding(
                    padding: const EdgeInsets.only(top: 6, left: 2),
                    child: Text(
                      'Showing ${rows.length} of $totalRecords records',
                      style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                    ),
                  ),
              ],
            ),
          ),

          if (loading) const LinearProgressIndicator(minHeight: 2),

          // Content Area
          Expanded(
            child: RefreshIndicator(
              onRefresh: load,
              child: _buildBody(),
            ),
          ),

          // Pagination Bar
          if (!loading && error == null && lastPage > 1)
            Container(
              padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
              decoration: BoxDecoration(
                color: Colors.white,
                border: Border(top: BorderSide(color: Colors.grey.shade200)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  ElevatedButton.icon(
                    onPressed: page > 1
                        ? () {
                            setState(() => page--);
                            load();
                          }
                        : null,
                    icon: const Icon(Icons.chevron_left_rounded, size: 18),
                    label: const Text('Previous'),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    ),
                  ),
                  Text(
                    'Page $page of $lastPage',
                    style: TextStyle(
                      fontWeight: FontWeight.w600,
                      color: Colors.grey.shade800,
                      fontSize: 13,
                    ),
                  ),
                  ElevatedButton.icon(
                    onPressed: page < lastPage
                        ? () {
                            setState(() => page++);
                            load();
                          }
                        : null,
                    icon: const Icon(Icons.chevron_right_rounded, size: 18),
                    label: const Text('Next'),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildBody() {
    if (error != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.error_outline_rounded, size: 54, color: Colors.red.shade400),
              const SizedBox(height: 14),
              Text(
                'Could not load attendance',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.grey.shade800),
              ),
              const SizedBox(height: 8),
              Text(
                error!,
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 14, color: Colors.grey.shade600),
              ),
              const SizedBox(height: 20),
              ElevatedButton.icon(
                onPressed: load,
                icon: const Icon(Icons.refresh_rounded),
                label: const Text('Retry'),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
              ),
            ],
          ),
        ),
      );
    }

    if (rows.isEmpty && !loading) {
      return ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        children: [
          SizedBox(height: MediaQuery.of(context).size.height * 0.2),
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.event_busy_rounded, size: 64, color: Colors.grey.shade400),
                const SizedBox(height: 16),
                Text(
                  'No attendance records found',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Colors.grey.shade700),
                ),
                const SizedBox(height: 6),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24.0),
                  child: Text(
                    (from != null && to != null)
                        ? 'No attendance records between ${DateFormat('dd MMM yyyy').format(from!)} and ${DateFormat('dd MMM yyyy').format(to!)}.'
                        : 'Try adjusting the date range or status filters.',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 13, color: Colors.grey.shade500),
                  ),
                ),
                const SizedBox(height: 16),
                if (from != null || to != null || status.isNotEmpty)
                  OutlinedButton.icon(
                    onPressed: _clearFilters,
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
      padding: const EdgeInsets.all(12),
      physics: const AlwaysScrollableScrollPhysics(),
      itemCount: rows.length,
      separatorBuilder: (_, __) => const SizedBox(height: 10),
      itemBuilder: (context, index) {
        final row = rows[index];
        final recordDate = row['attendance_date']?.toString() ?? row['login_date']?.toString() ?? '';
        final statusText = row['attendance']?.toString() ?? 'Present';
        final inTime = row['login_at']?.toString() ?? '—';
        final outTime = row['logout_at']?.toString() ?? '—';
        final logHours = row['log_time'] != null ? '${row['log_time']} hrs' : null;
        final employeeName = row['employee'] is Map
            ? (row['employee']['emp_name'] ?? row['employee']['username'])
            : (row['username'] ?? '');
        final device = row['device']?.toString();

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
                // Top row: Date & Status Badge
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.calendar_today_rounded, size: 16, color: Colors.grey.shade700),
                        const SizedBox(width: 8),
                        Text(
                          _formatDisplayDate(recordDate),
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: _getStatusBgColor(statusText),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: _getStatusColor(statusText).withValues(alpha: 0.3)),
                      ),
                      child: Text(
                        statusText,
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: _getStatusColor(statusText),
                        ),
                      ),
                    ),
                  ],
                ),

                const Divider(height: 20),

                // In & Out times
                Row(
                  children: [
                    Expanded(
                      child: Row(
                        children: [
                          Icon(Icons.login_rounded, size: 16, color: Colors.green.shade600),
                          const SizedBox(width: 6),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Punch In', style: TextStyle(fontSize: 11, color: Colors.grey.shade500)),
                              Text(
                                inTime,
                                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    Expanded(
                      child: Row(
                        children: [
                          Icon(Icons.logout_rounded, size: 16, color: Colors.red.shade600),
                          const SizedBox(width: 6),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Punch Out', style: TextStyle(fontSize: 11, color: Colors.grey.shade500)),
                              Text(
                                outTime,
                                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    if (logHours != null)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.blue.shade50,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Row(
                          children: [
                            Icon(Icons.timer_outlined, size: 14, color: Colors.blue.shade700),
                            const SizedBox(width: 4),
                            Text(
                              logHours,
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: Colors.blue.shade700,
                              ),
                            ),
                          ],
                        ),
                      ),
                  ],
                ),

                // Employee name and device footer if available
                if ((employeeName != null && employeeName.toString().isNotEmpty) ||
                    (device != null && device.isNotEmpty)) ...[
                  const SizedBox(height: 10),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      if (employeeName != null && employeeName.toString().isNotEmpty)
                        Text(
                          'Emp: $employeeName',
                          style: TextStyle(fontSize: 12, color: Colors.grey.shade600, fontStyle: FontStyle.italic),
                        ),
                      if (device != null && device.isNotEmpty)
                        Row(
                          children: [
                            Icon(Icons.devices_rounded, size: 12, color: Colors.grey.shade500),
                            const SizedBox(width: 4),
                            Text(
                              device,
                              style: TextStyle(fontSize: 11, color: Colors.grey.shade500),
                            ),
                          ],
                        ),
                    ],
                  ),
                ],
              ],
            ),
          ),
        );
      },
    );
  }
}
