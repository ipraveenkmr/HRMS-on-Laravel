import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:hrms/common/theme_helper.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
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
    final primaryColor = Theme.of(context).primaryColor;
    final accentColor = Theme.of(context).colorScheme.secondary;

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
        physics: const BouncingScrollPhysics(),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              const SizedBox(height: 10),
              Card(
                elevation: 3,
                shadowColor: Colors.black12,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        Text(
                          "Request Leave",
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Colors.grey.shade800,
                          ),
                        ),
                        const SizedBox(height: 20),
                        
                        // Leave Reason Input
                        Container(
                          decoration: ThemeHelper().inputBoxDecorationShaddow(),
                          child: TextField(
                            controller: leavereasoncontroller,
                            style: const TextStyle(color: Colors.black),
                            decoration: InputDecoration(
                              labelText: 'Leave Reason',
                              hintText: 'Enter reason for leave',
                              fillColor: Colors.white,
                              filled: true,
                              prefixIcon: Icon(Icons.edit_note, color: primaryColor),
                              contentPadding: const EdgeInsets.fromLTRB(20, 15, 20, 15),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: BorderSide(color: primaryColor, width: 2),
                              ),
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: BorderSide(color: Colors.grey.shade300),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(height: 25.0),
                        
                        // Leave From Date Selection
                        Text(
                          'Leave From:',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                            color: Colors.grey.shade700,
                          ),
                        ),
                        const SizedBox(height: 8.0),
                        Row(
                          children: <Widget>[
                            Expanded(
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(color: Colors.grey.shade300),
                                ),
                                child: Text(
                                  _dateString(),
                                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
                                ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            ElevatedButton.icon(
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
                              style: ElevatedButton.styleFrom(
                                backgroundColor: primaryColor,
                                foregroundColor: Colors.white,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                              ),
                              icon: const Icon(Icons.calendar_today, size: 16),
                              label: const Text('Pick Date'),
                            ),
                          ],
                        ),
                        const SizedBox(height: 25.0),
                        
                        // Leave To Date Selection
                        Text(
                          'Leave To:',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                            color: Colors.grey.shade700,
                          ),
                        ),
                        const SizedBox(height: 8.0),
                        Row(
                          children: <Widget>[
                            Expanded(
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(color: Colors.grey.shade300),
                                ),
                                child: Text(
                                  _dateToString(),
                                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
                                ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            ElevatedButton.icon(
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
                              style: ElevatedButton.styleFrom(
                                backgroundColor: primaryColor,
                                foregroundColor: Colors.white,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                              ),
                              icon: const Icon(Icons.calendar_today, size: 16),
                              label: const Text('Pick Date'),
                            ),
                          ],
                        ),
                        const SizedBox(height: 35.0),
                        
                        // Submit Button
                        Container(
                          width: double.infinity,
                          height: 50,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(12),
                            gradient: LinearGradient(
                              colors: [primaryColor, accentColor],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: primaryColor.withOpacity(0.3),
                                blurRadius: 8,
                                offset: const Offset(0, 4),
                              )
                            ]
                          ),
                          child: ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.transparent,
                              shadowColor: Colors.transparent,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                            child: Text(
                              'Apply Leave'.toUpperCase(),
                              style: const TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white),
                            ),
                            onPressed: () {
                              if (leavereasoncontroller.text.isEmpty) {
                                Get.snackbar("Validation Error", "Please fill in the leave reason");
                                return;
                              }
                              applyLeavehere();
                            },
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
