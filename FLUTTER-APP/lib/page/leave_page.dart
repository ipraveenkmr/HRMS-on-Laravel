import 'package:dio/dio.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../constants.dart';
import '../door/widgets/cdotcomponents.dart';
import '../door/widgets/header_widget.dart';

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
    String username = prefs.getString('username').toString();
    var response = await Dio().get(link + "leave/calculator/" + username);
    print('Leave: ' + response.data[0]['remaining_CL_Days'].toString());
    setState(() {
      remaining_CL_Days = response.data[0]['remaining_CL_Days'].toString();
      remaining_EI_Days = response.data[0]['remaining_EI_Days'].toString();
      remaining_LWP_Days = response.data[0]['remaining_LWP_Days'].toString();
      remaining_other_leave_in_days = response.data[0]['remaining_other_leave_in_days'].toString();
      remaining_medical_leave_in_days = response.data[0]['remaining_medical_leave_in_days'].toString();
    });
  }

  getUsers() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String username = prefs.getString('username').toString();
    var response = await Dio().get(link + "leave/employee/" + username);
    return response.data;
  }

  Widget buildText(String text) =>
      Center(
        child: Text(
          text,
          style: TextStyle(fontSize: 24, color: Colors.black87),
        ),
      );

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          "My Leaves",
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.normal),
        ),
        elevation: 0.5,
        iconTheme: IconThemeData(color: Colors.white),
        flexibleSpace: Container(
          decoration: BoxDecoration(
              gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: <Color>[
                    Theme
                        .of(context)
                        .primaryColor,
                    Theme
                        .of(context)
                        .colorScheme
                        .secondary,
                  ])),
        ),
      ),
      drawer: CdotComponents.sidenav(),
      body: SingleChildScrollView(
        child: Column(
          children: [
        Card(
        child: Column(
        mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            Container(
              padding: EdgeInsets.symmetric(
                  horizontal: 18.0, vertical: 15.0),
              child: Column(children: <Widget>[
                const SizedBox(height: 3),
                const SizedBox(height: 3),
                Row(children: <Widget>[
                  Text("Remaining CL Leave:      ",
                      style: TextStyle(
                          fontWeight: FontWeight.w600)),
                  Text(remaining_CL_Days ??
                      'None'),
                ]),
                Row(children: <Widget>[
                  Text("Remaining EI Leave: ",
                      style: TextStyle(
                          fontWeight: FontWeight.w600)),
                  Text(remaining_EI_Days ??
                      'None'),
                ]),
                const SizedBox(height: 3),
                Row(children: <Widget>[
                  Text("Remaining LWP Leave:      ",
                      style: TextStyle(
                          fontWeight: FontWeight.w600)),
                  Text(remaining_LWP_Days ??
                      'None'),
                ]),
                const SizedBox(height: 3),
                Row(children: <Widget>[
                  Text("Remaining Medical Leave: ",
                      style: TextStyle(
                          fontWeight: FontWeight.w600)),
                  Text(remaining_medical_leave_in_days ??
                      'None'),
                ]),
                Row(children: <Widget>[
                  Text("Remaining Other Leave:  ",
                      style: TextStyle(
                          fontWeight: FontWeight.w600)),
                  Text(remaining_other_leave_in_days ??
                      'None'),
                ]),
              ]),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: <Widget>[
              ],
            ),
          ],
        ),
      ),
      new FutureBuilder(
        future: getUsers(),
        builder: (context, AsyncSnapshot snapshot) {
          switch (snapshot.connectionState) {
            case ConnectionState.waiting:
              return Center(child: CircularProgressIndicator());
            default:
              if (snapshot.hasError) {
                print(snapshot.error);
                return buildText('Something Went Wrong Try later');
              } else {
                if (!snapshot.hasData) {
                  return buildText('No Users Found');
                } else
                  return ListView.builder(
                      shrinkWrap: true,
                      itemCount: users.length,
                      itemBuilder: (BuildContext context, int index) {
                        return Card(
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: <Widget>[
                              Container(
                                padding: EdgeInsets.symmetric(
                                    horizontal: 18.0, vertical: 15.0),
                                child: Column(children: <Widget>[
                                  const SizedBox(height: 3),
                                  const SizedBox(height: 3),
                                  Row(children: <Widget>[
                                    Text("Leave Status: ",
                                        style: TextStyle(
                                            fontWeight: FontWeight.w600)),
                                    Text(users[index]['leave_status'] ??
                                        'None'),
                                  ]),
                                  Row(children: <Widget>[
                                    Text("Reason: ",
                                        style: TextStyle(
                                            fontWeight: FontWeight.w600)),
                                    Text(users[index]['leave_reason'] ??
                                        'None'),
                                  ]),
                                  const SizedBox(height: 3),
                                  Row(children: <Widget>[
                                    Text("From:    ",
                                        style: TextStyle(
                                            fontWeight: FontWeight.w600)),
                                    Text(users[index]['leave_from_date'] ??
                                        'None'),
                                  ]),
                                  const SizedBox(height: 3),
                                  Row(children: <Widget>[
                                    Text("To:    ",
                                        style: TextStyle(
                                            fontWeight: FontWeight.w600)),
                                    Text(users[index]['leave_to_date'] ??
                                        'None'),
                                  ]),
                                ]),
                              ),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.end,
                                children: <Widget>[
                                  // TextButton(
                                  //   child: const Text('Delete',
                                  //     style: TextStyle(color: Color(
                                  //         0xfff11616)),
                                  //   ),
                                  //   onPressed: () {
                                  //     deleteUser(users[index]['person_id']);
                                  //   },
                                  // ),
                                  // TextButton(
                                  //   child: const Text('Edit'),
                                  //   onPressed: () {
                                  //     Get.to(EditCommonPage(), arguments: users[index]['person_id']);
                                  //   },
                                  // ),
                                ],
                              ),
                            ],
                          ),
                        );
                      });
              }
          }
        },
      ),
      ],
    ),)
    ,
    );
  }
}
