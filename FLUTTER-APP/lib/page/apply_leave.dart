import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:hrms/common/theme_helper.dart';
import 'package:flutter/services.dart';
import '../controller/authentication.dart';
import '../door/widgets/cdotcomponents.dart';
import 'LeaveModel.dart';

class ApplyLeavePage extends StatefulWidget {
  @override
  _ApplyLeaveState createState() => _ApplyLeaveState();
}

class _ApplyLeaveState extends State<ApplyLeavePage> {
  double _headerHeight = 230;
  final Key _formKey = GlobalKey<FormState>();
  late String email;
  late String password;
  var my_services;
  DateTime? _date;
  DateTime? _dateto;
  GlobalKey<FormState> formkey = GlobalKey<FormState>();

  TextEditingController leavetypedcontroller = TextEditingController();
  TextEditingController leaveindaysdcontroller = TextEditingController();
  TextEditingController leaveinhoursdcontroller = TextEditingController();
  TextEditingController leavereasoncontroller = TextEditingController();
  TextEditingController leavefromcontroller = TextEditingController();
  TextEditingController leavetocontroller = TextEditingController();

  void applyLeavehere() {
    applyLeave(leavefromcontroller.text, leavetocontroller.text,
        leavereasoncontroller.text);
  }

  @override
  void dispose() {
    leavetypedcontroller.dispose();
    leaveindaysdcontroller.dispose();
    leaveinhoursdcontroller.dispose();
    leavereasoncontroller.dispose();
    leavefromcontroller.dispose();
    leavetocontroller.dispose();
    super.dispose();
  }

  _dateString() {
    if (_date == null) {
      _date = DateTime.now();
      leavefromcontroller.text = '${_date?.year}-${_date?.month}-${_date?.day}';
      return '${_date?.year}-${_date?.month}-${_date?.day}';
    } else {
      leavefromcontroller.text = '${_date?.year}-${_date?.month}-${_date?.day}';
      return '${_date?.year}-${_date?.month}-${_date?.day}';
    }
  }

  _dateToString() {
    if (_dateto == null) {
      _dateto = DateTime.now();
      leavetocontroller.text =
          '${_dateto?.year}-${_dateto?.month}-${_dateto?.day}';
      return '${_dateto?.year}-${_dateto?.month}-${_dateto?.day}';
    } else {
      leavetocontroller.text =
          '${_dateto?.year}-${_dateto?.month}-${_dateto?.day}';
      return '${_dateto?.year}-${_dateto?.month}-${_dateto?.day}';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          "Apply Leave",
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
            SizedBox(height: 20.0),
            SizedBox(
              width: MediaQuery.of(context).size.width,
              child: Card(
                  elevation: 10,
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(20, 25, 20, 50),
                    child: Column(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: <Widget>[
                          Container(
                            child: TextField(
                              controller: leavereasoncontroller,
                              style: TextStyle(color: Colors.black),
                              decoration: ThemeHelper().textInputDecoration(
                                  'Leave Reason', 'Enter leave reason'),
                            ),
                            decoration: ThemeHelper().inputBoxDecorationShaddow(),
                          ),
                          SizedBox(height: 25.0),
                          Container(
                            alignment: Alignment.topLeft,
                            child: Text('Leave From: ',
                                style: TextStyle(
                                    fontWeight: FontWeight.normal,
                                    fontSize: 16),
                                maxLines: 2),
                          ),
                          SizedBox(height: 10.0),
                          Row(children: <Widget>[
                            const SizedBox(
                              width: 18,
                            ),
                            SizedBox(
                              height: 30.0,
                              width: 90.0,
                              child: Padding(
                                  padding:
                                      const EdgeInsets.fromLTRB(0, 6, 0, 0),
                                  child: Text(_dateString())),
                            ),
                            const SizedBox(
                              width: 20,
                            ),
                            SizedBox(
                                height: 30.0,
                                width: 100.0,
                                child: OutlinedButton.icon(
                                    onPressed: () async {
                                      final result = await showDatePicker(
                                          context: context,
                                          initialDate: DateTime.now(),
                                          firstDate: DateTime(2020),
                                          lastDate: DateTime(2030));
                                      if (result != null) {
                                        setState(() {
                                          _date = result;
                                        });
                                      }
                                    },
                                    icon: const Icon(Icons.calendar_today),
                                    label: const Text('Date'))),
                          ]),
                          SizedBox(height: 25.0),
                          Container(
                            alignment: Alignment.topLeft,
                            child: Text('Leave To: ',
                                style: TextStyle(
                                    fontWeight: FontWeight.normal,
                                    fontSize: 16),
                                maxLines: 2),
                          ),
                          SizedBox(height: 10.0),
                          Row(children: <Widget>[
                            const SizedBox(
                              width: 18,
                            ),
                            SizedBox(
                              height: 30.0,
                              width: 90.0,
                              child: Padding(
                                  padding:
                                      const EdgeInsets.fromLTRB(0, 6, 0, 0),
                                  child: Text(_dateToString())),
                            ),
                            const SizedBox(
                              width: 20,
                            ),
                            SizedBox(
                                height: 30.0,
                                width: 100.0,
                                child: OutlinedButton.icon(
                                    onPressed: () async {
                                      final result = await showDatePicker(
                                          context: context,
                                          initialDate: DateTime.now(),
                                          firstDate: DateTime(2020),
                                          lastDate: DateTime(2030));
                                      if (result != null) {
                                        setState(() {
                                          _dateto = result;
                                        });
                                      }
                                    },
                                    icon: const Icon(Icons.calendar_today),
                                    label: const Text('Date'))),
                          ]),
                          SizedBox(height: 20.0),
                          Container(
                            decoration:
                                ThemeHelper().buttonBoxDecoration(context),
                            child: ElevatedButton(
                              style: ThemeHelper().buttonStyle(),
                              child: Padding(
                                padding: EdgeInsets.fromLTRB(40, 10, 40, 10),
                                child: Text(
                                  'Apply  Leave'.toUpperCase(),
                                  style: TextStyle(
                                      fontSize: 14,
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
                        ]),
                  )),
            ),
          ],
        ),
      ),
    );
  }
}
