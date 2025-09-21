import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:hrms/common/theme_helper.dart';
import 'package:flutter/services.dart';
import '../controller/authentication.dart';
import '../door/widgets/cdotcomponents.dart';

class ApplyLoanPage extends StatefulWidget {
  @override
  _ApplyLoanPageState createState() => _ApplyLoanPageState();
}

class _ApplyLoanPageState extends State<ApplyLoanPage> {
  double _headerHeight = 230;
  final Key _formKey = GlobalKey<FormState>();
  late String email;
  late String password;
  var my_services;
  GlobalKey<FormState> formkey = GlobalKey<FormState>();
  List tasks = [];
  TextEditingController amountcontroller = TextEditingController();
  TextEditingController periodcontroller = TextEditingController();
  TextEditingController purposecontroller = TextEditingController();

  void applyLoanhere() {
    applyLoan(
        amountcontroller.text,
        periodcontroller.text,
        purposecontroller.text
    );
  }

  @override
  void dispose() {
    amountcontroller.dispose();
    periodcontroller.dispose();
    purposecontroller.dispose();
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
          "Apply Loan",
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
                                  keyboardType: TextInputType.number,
                                  style: TextStyle(color: Colors.black),
                                  inputFormatters: [
                                    FilteringTextInputFormatter.digitsOnly
                                  ],
                                  controller: amountcontroller,
                                  decoration: ThemeHelper().textInputDecoration(
                                      'Loan amount', 'Loan amount'),
                                ),
                                decoration:
                                ThemeHelper().inputBoxDecorationShaddow(),
                              ),
                              SizedBox(height: 20.0),
                              Container(
                                child: TextField(
                                  keyboardType: TextInputType.number,
                                  inputFormatters: [
                                    FilteringTextInputFormatter.digitsOnly
                                  ],
                                  controller: periodcontroller,
                                  style: TextStyle(color: Colors.black),
                                  decoration: ThemeHelper().textInputDecoration(
                                      'Loan period in month', 'Loan period in month'),
                                ),
                                decoration:
                                ThemeHelper().inputBoxDecorationShaddow(),
                              ),
                              SizedBox(height: 20.0),
                              Container(
                                child: TextField(
                                  controller: purposecontroller,
                                  style: TextStyle(color: Colors.black),
                                  decoration: ThemeHelper().textInputDecoration(
                                      'Purpose', 'Enter purpose'),
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
                                      'Apply Loan'.toUpperCase(),
                                      style: TextStyle(
                                          fontSize: 14,
                                          fontWeight: FontWeight.normal,
                                          color: Colors.white),
                                    ),
                                  ),
                                  onPressed: () {
                                    applyLoanhere();
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
