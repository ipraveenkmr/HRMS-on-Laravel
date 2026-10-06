import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:hrms/common/theme_helper.dart';
import '../controller/authentication.dart';
import 'forgot_password_page.dart';
import 'widgets/header_widget.dart';
import 'package:get/get.dart';
import '../constants.dart';
import 'package:dio/dio.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({Key? key}) : super(key: key);

  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  double _headerHeight = 230;
  final Key _formKey = GlobalKey<FormState>();
  late String email;
  late String password;
  GlobalKey<FormState> formkey = GlobalKey<FormState>();
  TextEditingController useremailcontroller = TextEditingController();
  TextEditingController userpasswordcontroller = TextEditingController();
  bool _showPassword = false;
  bool _submitting = false;

  void login() async {
    if (useremailcontroller.text.isEmpty || userpasswordcontroller.text.isEmpty) {
      Get.snackbar("Required Fields", "Please enter both User Name and Password");
      return;
    }
    if (_submitting) return;
    setState(() => _submitting = true);
    try {
      await userlogin(useremailcontroller.text.trim(), userpasswordcontroller.text);
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  void dispose() {
    useremailcontroller.dispose();
    userpasswordcontroller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final primaryColor = Theme.of(context).primaryColor;
    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      body: SingleChildScrollView(
        child: Column(
          children: [
            Container(
              height: _headerHeight,
              child: HeaderWidget(_headerHeight, true,
                  Icons.lock_person_rounded), // modern icon
            ),
            SafeArea(
              child: Container(
                  padding: EdgeInsets.fromLTRB(20, 10, 20, 10),
                  margin: EdgeInsets.fromLTRB(20, 0, 20, 10),
                  child: Column(
                    children: [
                      Text(
                        AppConstants.appTitle.toUpperCase(),
                        style: TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.bold,
                          color: primaryColor,
                          letterSpacing: 2,
                        ),
                      ),
                      Text(
                        'Human Resource Management System',
                        style: TextStyle(color: Colors.grey.shade600, fontSize: 13),
                      ),
                      SizedBox(height: 30.0),
                      Form(
                          key: _formKey,
                          child: Column(
                            children: [
                              Container(
                                decoration: ThemeHelper().inputBoxDecorationShaddow(),
                                child: TextField(
                                  controller: useremailcontroller,
                                  style: TextStyle(color: Colors.black),
                                  decoration: InputDecoration(
                                    labelText: 'Username / Email',
                                    hintText: 'Enter your email or username',
                                    fillColor: Colors.white,
                                    filled: true,
                                    prefixIcon: Icon(Icons.person_outline, color: primaryColor),
                                    contentPadding: EdgeInsets.fromLTRB(20, 15, 20, 15),
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
                              SizedBox(height: 20.0),
                              Container(
                                decoration: ThemeHelper().inputBoxDecorationShaddow(),
                                child: TextField(
                                  controller: userpasswordcontroller,
                                  style: TextStyle(color: Colors.black),
                                  obscureText: !_showPassword,
                                  decoration: InputDecoration(
                                    labelText: 'Password',
                                    hintText: 'Enter your password',
                                    fillColor: Colors.white,
                                    filled: true,
                                    prefixIcon: Icon(Icons.lock_outline, color: primaryColor),
                                    suffixIcon: IconButton(
                                      tooltip: _showPassword ? 'Hide password' : 'Show password',
                                      icon: Icon(_showPassword ? Icons.visibility_off : Icons.visibility),
                                      onPressed: () => setState(() => _showPassword = !_showPassword),
                                    ),
                                    contentPadding: EdgeInsets.fromLTRB(20, 15, 20, 15),
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
                              SizedBox(height: 25.0),
                              Container(
                                width: double.infinity,
                                height: 50,
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(12),
                                  gradient: LinearGradient(
                                    colors: [primaryColor, Theme.of(context).colorScheme.secondary],
                                    begin: Alignment.topLeft,
                                    end: Alignment.bottomRight,
                                  ),
                                  boxShadow: [
                                    BoxShadow(
                                      color: primaryColor.withOpacity(0.3),
                                      blurRadius: 8,
                                      offset: Offset(0, 4),
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
                                    _submitting ? 'SIGNING IN…' : 'SIGN IN',
                                    style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.white),
                                  ),
                                  onPressed: _submitting ? null : login,
                                ),
                              ),
                              if (AppConstants.dummyMode) ...[
                                SizedBox(height: 25.0),
                                Container(
                                  width: double.infinity,
                                  padding: EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: Colors.indigo.shade50,
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(color: Colors.indigo.shade100),
                                  ),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        children: [
                                          Icon(Icons.info_outline, color: Colors.indigo.shade800, size: 18),
                                          SizedBox(width: 6),
                                          Text(
                                            "Demo Login Credentials",
                                            style: TextStyle(
                                              fontWeight: FontWeight.bold,
                                              color: Colors.indigo.shade900,
                                              fontSize: 13,
                                            ),
                                          ),
                                        ],
                                      ),
                                      SizedBox(height: 8),
                                      Text(
                                        "• admin@company.com  (Office Work Mode)\n"
                                        "• john.doe@company.com (Field Work Mode)",
                                        style: TextStyle(
                                          color: Colors.indigo.shade700,
                                          fontSize: 12,
                                          height: 1.4,
                                        ),
                                      ),
                                      SizedBox(height: 4),
                                      Text(
                                        "* Use any dummy password to log in.",
                                        style: TextStyle(
                                          color: Colors.indigo.shade600,
                                          fontSize: 11,
                                          fontStyle: FontStyle.italic,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
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
