import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:hrms/common/theme_helper.dart';
import '../controller/authentication.dart';
import '../door/widgets/cdotcomponents.dart';

class AddTaskPage extends StatefulWidget {

  @override
  _AddtaskState createState() => _AddtaskState();
}

class _AddtaskState extends State<AddTaskPage> {
  double _headerHeight = 230;
  final Key _formKey = GlobalKey<FormState>();
  late String email;
  late String password;
  GlobalKey<FormState> formkey = GlobalKey<FormState>();
  TextEditingController useremailcontroller = TextEditingController();
  TextEditingController userpasswordcontroller = TextEditingController();

  TextEditingController leavetypedcontroller = TextEditingController();
  TextEditingController leaveindaysdcontroller = TextEditingController();
  TextEditingController leaveinhoursdcontroller = TextEditingController();
  TextEditingController leavereasoncontroller = TextEditingController();
  TextEditingController leavefromcontroller = TextEditingController();
  TextEditingController leavetocontroller = TextEditingController();

  void applyLeavehere() {
    // applyLeave(useremailcontroller.text, userpasswordcontroller.text);
  }

  @override
  void dispose() {
    useremailcontroller.dispose();
    userpasswordcontroller.dispose();
    leavetypedcontroller.dispose();
    leaveindaysdcontroller.dispose();
    leaveinhoursdcontroller.dispose();
    leavereasoncontroller.dispose();
    leavefromcontroller.dispose();
    leavetocontroller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          "Add Task",
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
                              Container(
                                child: TextField(
                                  controller: useremailcontroller,
                                  style: TextStyle(color: Colors.black),
                                  decoration: ThemeHelper().textInputDecoration(
                                      'Leave Type', 'Enter leave type'),
                                ),
                                decoration:
                                ThemeHelper().inputBoxDecorationShaddow(),
                              ),
                              SizedBox(height: 15.0),
                              Container(
                                child: TextField(
                                  controller: leavereasoncontroller,
                                  style: TextStyle(color: Colors.black),
                                  decoration: ThemeHelper().textInputDecoration(
                                      'Leave in Days', 'Enter leave in days'),
                                ),
                                decoration:
                                ThemeHelper().inputBoxDecorationShaddow(),
                              ),
                              SizedBox(height: 15.0),
                              Container(
                                child: TextField(
                                  controller: leavereasoncontroller,
                                  style: TextStyle(color: Colors.black),
                                  decoration: ThemeHelper().textInputDecoration(
                                      'Leave in Hours', 'Enter leave in hours'),
                                ),
                                decoration:
                                ThemeHelper().inputBoxDecorationShaddow(),
                              ),
                              SizedBox(height: 15.0),
                              Container(
                                child: TextField(
                                  controller: leavereasoncontroller,
                                  style: TextStyle(color: Colors.black),
                                  decoration: ThemeHelper().textInputDecoration(
                                      'Leave From', 'Enter from'),
                                ),
                                decoration:
                                ThemeHelper().inputBoxDecorationShaddow(),
                              ),
                              SizedBox(height: 15.0),
                              Container(
                                child: TextField(
                                  controller: leavereasoncontroller,
                                  style: TextStyle(color: Colors.black),
                                  decoration: ThemeHelper().textInputDecoration(
                                      'Leave To', 'Enter leave to'),
                                ),
                                decoration:
                                ThemeHelper().inputBoxDecorationShaddow(),
                              ),
                              SizedBox(height: 15.0),
                              Container(
                                child: TextField(
                                  controller: leavereasoncontroller,
                                  style: TextStyle(color: Colors.black),
                                  decoration: ThemeHelper().textInputDecoration(
                                      'Leave Reason', 'Enter leave reason'),
                                ),
                                decoration:
                                ThemeHelper().inputBoxDecorationShaddow(),
                              ),
                              SizedBox(height: 40.0),
                              Container(
                                decoration:
                                ThemeHelper().buttonBoxDecoration(context),
                                child: ElevatedButton(
                                  style: ThemeHelper().buttonStyle(),
                                  child: Padding(
                                    padding:
                                    EdgeInsets.fromLTRB(40, 10, 40, 10),
                                    child: Text(
                                      'Add Task'.toUpperCase(),
                                      style: TextStyle(
                                          fontSize: 20,
                                          fontWeight: FontWeight.normal,
                                          color: Colors.white),
                                    ),
                                  ),
                                  onPressed: () {
                                      applyLeavehere();
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
