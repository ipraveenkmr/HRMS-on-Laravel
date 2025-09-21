import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:hrms/common/theme_helper.dart';
import 'package:flutter/services.dart';
import '../controller/authentication.dart';
import '../door/widgets/cdotcomponents.dart';

class DailyTaskPage extends StatefulWidget {
  @override
  _DailyTaskState createState() => _DailyTaskState();
}

class _DailyTaskState extends State<DailyTaskPage> {
  double _headerHeight = 230;
  final Key _formKey = GlobalKey<FormState>();
  late String email;
  late String password;
  var my_services;
  GlobalKey<FormState> formkey = GlobalKey<FormState>();
  List tasks = [];
  TextEditingController taskcontroller = TextEditingController();
  TextEditingController managercontroller = TextEditingController();
  TextEditingController descriptioncontroller = TextEditingController();

  void applyTaskhere() {
    dailyTask(
        taskcontroller.text,
        managercontroller.text,
        descriptioncontroller.text
    );
  }

  @override
  void dispose() {
    taskcontroller.dispose();
    managercontroller.dispose();
    descriptioncontroller.dispose();
    super.dispose();
  }


  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          "Update Daily Task",
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
        child: Column(
          children: [
            SizedBox(height: 30.0),
            SafeArea(
              child: Container(
                  padding: EdgeInsets.fromLTRB(20, 10, 20, 10),
                  margin: EdgeInsets.fromLTRB(20, 10, 20, 10),
                  // This will be the login form
                  child: Column(
                    children: [
                      SizedBox(height: 10.0),
                      Form(
                          key: _formKey,
                          child: Column(
                            children: [
                              SizedBox(height: 20.0),
                              Container(
                                child: TextField(
                                  controller: taskcontroller,
                                  style: TextStyle(color: Colors.black),
                                  decoration: ThemeHelper().textInputDecoration(
                                      'Enter Task', 'Enter task name'),
                                ),
                                decoration:
                                ThemeHelper().inputBoxDecorationShaddow(),
                              ),
                              SizedBox(height: 20.0),
                              Container(
                                child: TextField(
                                  controller: managercontroller,
                                  style: TextStyle(color: Colors.black),
                                  decoration: ThemeHelper().textInputDecoration(
                                      'Manager Name', 'Enter manager name'),
                                ),
                                decoration:
                                ThemeHelper().inputBoxDecorationShaddow(),
                              ),
                              SizedBox(height: 20.0),
                              Container(
                                child: TextField(
                                  controller: descriptioncontroller,
                                  style: TextStyle(color: Colors.black),
                                  decoration: ThemeHelper().textInputDecoration(
                                      'Description', 'Enter description'),
                                ),
                                decoration:
                                ThemeHelper().inputBoxDecorationShaddow(),
                              ),
                              SizedBox(height: 20.0),
                              Container(
                                decoration:
                                    ThemeHelper().buttonBoxDecoration(context),
                                child: ElevatedButton(
                                  style: ThemeHelper().buttonStyle(),
                                  child: Padding(
                                    padding:
                                        EdgeInsets.fromLTRB(40, 10, 40, 10),
                                    child: Text(
                                      'Update and Logout'.toUpperCase(),
                                      style: TextStyle(
                                          fontSize: 14,
                                          fontWeight: FontWeight.normal,
                                          color: Colors.white),
                                    ),
                                  ),
                                  onPressed: () {
                                    applyTaskhere();
                                  },
                                ),
                              ),
                              Container(
                                margin: EdgeInsets.fromLTRB(10, 20, 10, 20),
                              ),
                            ],
                          )),
                    ],
                  )),
            ),
          ],
        ),
      ),
    );
  }

  _buildFooterLogo() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: <Widget>[
        Image.asset(
          'assets/logo.png',
          height: 70,
        ),
        SizedBox(height: 10),
      ],
    );
  }
}
