import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:hrms/common/theme_helper.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import '../controller/authentication.dart';
import '../door/widgets/cdotcomponents.dart';

class DailyTaskPage extends StatefulWidget {
  @override
  _DailyTaskState createState() => _DailyTaskState();
}

class _DailyTaskState extends State<DailyTaskPage> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final TextEditingController taskcontroller = TextEditingController();
  final TextEditingController managercontroller = TextEditingController();
  final TextEditingController descriptioncontroller = TextEditingController();

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
                      children: [
                        Text(
                          "Submit Daily Task & Sign Out",
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Colors.grey.shade800,
                          ),
                        ),
                        const SizedBox(height: 20),

                        // Task Input
                        Container(
                          decoration: ThemeHelper().inputBoxDecorationShaddow(),
                          child: TextField(
                            controller: taskcontroller,
                            style: const TextStyle(color: Colors.black),
                            decoration: InputDecoration(
                              labelText: 'Task Title',
                              hintText: 'Enter task title',
                              fillColor: Colors.white,
                              filled: true,
                              prefixIcon: Icon(Icons.assignment_outlined, color: Theme.of(context).primaryColor),
                              contentPadding: const EdgeInsets.fromLTRB(20, 15, 20, 15),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: BorderSide(color: Theme.of(context).primaryColor, width: 2),
                              ),
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: BorderSide(color: Colors.grey.shade300),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(height: 20.0),

                        // Manager Input
                        Container(
                          decoration: ThemeHelper().inputBoxDecorationShaddow(),
                          child: TextField(
                            controller: managercontroller,
                            style: const TextStyle(color: Colors.black),
                            decoration: InputDecoration(
                              labelText: 'Supervisor / Manager',
                              hintText: 'Enter supervisor name',
                              fillColor: Colors.white,
                              filled: true,
                              prefixIcon: Icon(Icons.supervisor_account_outlined, color: Theme.of(context).primaryColor),
                              contentPadding: const EdgeInsets.fromLTRB(20, 15, 20, 15),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: BorderSide(color: Theme.of(context).primaryColor, width: 2),
                              ),
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: BorderSide(color: Colors.grey.shade300),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(height: 20.0),

                        // Description Input
                        Container(
                          decoration: ThemeHelper().inputBoxDecorationShaddow(),
                          child: TextField(
                            controller: descriptioncontroller,
                            style: const TextStyle(color: Colors.black),
                            decoration: InputDecoration(
                              labelText: 'Task Description',
                              hintText: 'Enter daily update details',
                              fillColor: Colors.white,
                              filled: true,
                              prefixIcon: Icon(Icons.notes_outlined, color: Theme.of(context).primaryColor),
                              contentPadding: const EdgeInsets.fromLTRB(20, 15, 20, 15),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: BorderSide(color: Theme.of(context).primaryColor, width: 2),
                              ),
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: BorderSide(color: Colors.grey.shade300),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(height: 35.0),

                        // Submit Button
                        Container(
                          width: double.infinity,
                          height: 50,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(12),
                            gradient: LinearGradient(
                              colors: [Theme.of(context).primaryColor, Theme.of(context).colorScheme.secondary],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: Theme.of(context).primaryColor.withOpacity(0.3),
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
                                  borderRadius: BorderRadius.circular(12)),
                            ),
                            child: Text(
                              'Submit and Sign Out'.toUpperCase(),
                              style: const TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white),
                            ),
                            onPressed: () {
                              if (taskcontroller.text.isEmpty || managercontroller.text.isEmpty || descriptioncontroller.text.isEmpty) {
                                Get.snackbar("Validation Error", "Please fill in all fields");
                                return;
                              }
                              applyTaskhere();
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
