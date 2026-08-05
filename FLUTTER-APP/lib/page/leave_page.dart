import 'package:dio/dio.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../constants.dart';
import '../door/widgets/cdotcomponents.dart';
import '../door/widgets/header_widget.dart';
import '../common/api_client.dart';

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

  @override
  void initState() {
    super.initState();
    getLeave();
    getUsers().then((data) {
      setState(() {
        users = data;
      });
    });
    getLeave();
  }

  getLeave() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String username = prefs.getString('username')?.toString() ?? '';
    if (username.isEmpty) return;
    try {
      var response = await ApiClient.client.get(link + "leave/calculator/" + username);
      if (response.statusCode == 200 && response.data != null && (response.data as List).isNotEmpty) {
        print('Leave: ' + response.data[0]['remaining_CL_Days'].toString());
        setState(() {
          remaining_CL_Days = response.data[0]['remaining_CL_Days']?.toString() ?? '0';
          remaining_EI_Days = response.data[0]['remaining_EI_Days']?.toString() ?? '0';
          remaining_LWP_Days = response.data[0]['remaining_LWP_Days']?.toString() ?? '0';
          remaining_other_leave_in_days = response.data[0]['remaining_other_leave_in_days']?.toString() ?? '0';
          remaining_medical_leave_in_days = response.data[0]['remaining_medical_leave_in_days']?.toString() ?? '0';
        });
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
    return response.data;
  }

  Widget buildText(String text) =>
      Center(
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
          "My Leaves",
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
              Text(
                "Leave Balance",
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.grey.shade800),
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
                  _buildBalanceCard("Casual Leave", remaining_CL_Days, [Colors.blue.shade400, Colors.blue.shade700]),
                  _buildBalanceCard("Earned Leave", remaining_EI_Days, [Colors.teal.shade400, Colors.teal.shade700]),
                  _buildBalanceCard("Leave Without Pay", remaining_LWP_Days, [Colors.orange.shade400, Colors.orange.shade700]),
                  _buildBalanceCard("Medical Leave", remaining_medical_leave_in_days, [Colors.purple.shade400, Colors.purple.shade700]),
                  _buildBalanceCard("Other Leave", remaining_other_leave_in_days, [Colors.blueGrey.shade400, Colors.blueGrey.shade700]),
                ],
              ),
              const SizedBox(height: 25),

              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    "Leave History",
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
                      return const Center(child: Padding(
                        padding: EdgeInsets.symmetric(vertical: 30.0),
                        child: CircularProgressIndicator(),
                      ));
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
                          
                          Color statusColor = Colors.orange;
                          Color statusBg = Colors.orange.shade50;
                          if (status == 'Approved') {
                            statusColor = Colors.green;
                            statusBg = Colors.green.shade50;
                          } else if (status == 'Rejected') {
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
                                    children: [
                                      Expanded(
                                        child: Text(
                                          leave['leave_reason'] ?? 'Personal Leave',
                                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                                        ),
                                      ),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                        decoration: BoxDecoration(
                                          color: statusBg,
                                          borderRadius: BorderRadius.circular(8),
                                          border: Border.all(color: statusColor.withOpacity(0.3)),
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
                                      Icon(Icons.date_range, size: 16, color: Colors.grey.shade500),
                                      const SizedBox(width: 6),
                                      Text(
                                        "Duration: ",
                                        style: TextStyle(color: Colors.grey.shade600, fontSize: 13),
                                      ),
                                      Text(
                                        "${leave['leave_from_date'] ?? 'N/A'}  to  ${leave['leave_to_date'] ?? 'N/A'}",
                                        style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13, color: Colors.grey.shade800),
                                      ),
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
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBalanceCard(String title, String count, List<Color> gradientColors) {
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
        ]
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
