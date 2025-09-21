import 'package:dio/dio.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../constants.dart';
import '../door/widgets/cdotcomponents.dart';

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
      setState(() {
        users = data;
      });
    });
  }

  getUsers() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String username = prefs.getString('username').toString();
    var response = await Dio().get(link + "tasks/employee/" + username);
    return response.data;
  }

  Widget buildText(String text) => Center(
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
          "My Tasks",
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
                Theme.of(context).primaryColor,
                Theme.of(context).colorScheme.secondary,
              ])),
        ),
      ),
      drawer: CdotComponents.sidenav(),
      body: SingleChildScrollView(
        child: new FutureBuilder(
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
                                    Row(children: <Widget>[
                                      Flexible(
                                        child: Text("Task: ",
                                            style: TextStyle(
                                                fontWeight: FontWeight.w600)),
                                      ),
                                      Flexible(
                                        child: Text(
                                            users[index]['task'].toString() ??
                                                'None',
                                            maxLines: 1),
                                      ),
                                    ]),
                                    const SizedBox(height: 3),
                                    Row(children: <Widget>[
                                      Text("Submission date: ",
                                          style: TextStyle(
                                              fontWeight: FontWeight.w600)),
                                      Text(DateFormat('EEEE, MMM d, yyyy')
                                              .format(DateTime.parse(
                                                  users[index]
                                                      ['submission_date'])) ??
                                          'None'),
                                    ]),
                                    const SizedBox(height: 3),
                                    Row(children: <Widget>[
                                      Text("Status: ",
                                          style: TextStyle(
                                              fontWeight: FontWeight.w600)),
                                      Text(users[index]['status'] ?? 'None'),
                                    ]),
                                    const SizedBox(height: 3),
                                    Row(children: <Widget>[
                                      Text("Description:    ",
                                          style: TextStyle(
                                              fontWeight: FontWeight.w600)),
                                      Text(users[index]['description'] ??
                                          'None'),
                                    ]),
                                  ]),
                                ),
                              ],
                            ),
                          );
                        });
                }
            }
          },
        ),
      ),
    );
  }
}
