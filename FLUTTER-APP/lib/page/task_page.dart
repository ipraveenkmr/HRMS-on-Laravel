import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../constants.dart';
import '../door/widgets/cdotcomponents.dart';
import '../common/api_client.dart';

class TaskPage extends StatefulWidget {
  const TaskPage({Key? key}) : super(key: key);

  @override
  State<TaskPage> createState() => _TaskPageState();
}

class _TaskPageState extends State<TaskPage> {
  List users = [];
  String link = AppConstants.apiLink;
  String e_id = "";

  @override
  void initState() {
    super.initState();
    getUsers().then((data) {
      if (mounted) {
        setState(() {
          users = data ?? [];
        });
      }
    });
  }

  getUsers() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String username = prefs.getString('username')?.toString() ?? '';
    if (username.isEmpty) return [];
    var response = await ApiClient.client.get(link + "tasks/employee/" + username);
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
        title: Text(
          "My Tasks",
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        elevation: 0,
        iconTheme: IconThemeData(color: Colors.white),
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
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    "Task Board",
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.grey.shade800),
                  ),
                  if (AppConstants.dummyMode)
                    Text(
                      "Dummy Mode Active",
                      style: TextStyle(fontSize: 11, color: Colors.amber.shade800, fontWeight: FontWeight.w600),
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
                      if (!snapshot.hasData || users.isEmpty) {
                        return buildText('No Tasks Assigned');
                      }
                      
                      return ListView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: users.length,
                          itemBuilder: (BuildContext context, int index) {
                            final task = users[index];
                            final status = task['status']?.toString() ?? 'Pending';

                            Color statusColor = Colors.orange;
                            Color statusBg = Colors.orange.shade50;
                            IconData statusIcon = Icons.pending_actions_outlined;
                            
                            if (status == 'Completed') {
                              statusColor = Colors.green;
                              statusBg = Colors.green.shade50;
                              statusIcon = Icons.check_circle_outline;
                            } else if (status == 'In Progress') {
                              statusColor = Colors.blue;
                              statusBg = Colors.blue.shade50;
                              statusIcon = Icons.run_circle_outlined;
                            }

                            String dateString = 'N/A';
                            try {
                              if (task['submission_date'] != null) {
                                dateString = DateFormat('EEEE, MMM d, yyyy')
                                    .format(DateTime.parse(task['submission_date']));
                              }
                            } catch (_) {}

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
                                  children: <Widget>[
                                    Row(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Icon(statusIcon, color: statusColor, size: 24),
                                        const SizedBox(width: 8),
                                        Expanded(
                                          child: Text(
                                            task['task']?.toString() ?? 'General Task',
                                            style: const TextStyle(
                                              fontSize: 16,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                          decoration: BoxDecoration(
                                            color: statusBg,
                                            borderRadius: BorderRadius.circular(8),
                                            border: Border.all(color: statusColor.withOpacity(0.3)),
                                          ),
                                          child: Text(
                                            status,
                                            style: TextStyle(
                                              color: statusColor,
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
                                          dateString,
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
                          });
                  }
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
