import 'package:flutter/material.dart';
import 'package:hrms/common/theme_helper.dart';
import '../controller/authentication.dart';
import 'widgets/header_widget.dart';
import 'package:get/get.dart';
import '../constants.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({Key? key}) : super(key: key);

  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final double _headerHeight = 230;
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final TextEditingController useremailcontroller = TextEditingController();
  final TextEditingController userpasswordcontroller = TextEditingController();
  bool _showPassword = false;
  bool _submitting = false;
  String? _errorMessage;

  void login() async {
    FocusScope.of(context).unfocus();
    setState(() => _errorMessage = null);

    final username = useremailcontroller.text.trim();
    final password = userpasswordcontroller.text;

    if (username.isEmpty && password.isEmpty) {
      setState(() => _errorMessage = "Please enter your username and password.");
      return;
    }
    if (username.isEmpty) {
      setState(() => _errorMessage = "Please enter your username or email address.");
      return;
    }
    if (password.isEmpty) {
      setState(() => _errorMessage = "Please enter your password.");
      return;
    }

    if (_submitting) return;
    setState(() => _submitting = true);

    try {
      final error = await userlogin(username, password);
      if (mounted && error != null) {
        setState(() => _errorMessage = error);
      }
    } catch (e) {
      if (mounted) {
        setState(() => _errorMessage = "Unable to sign in. Please check your connection and try again.");
      }
    } finally {
      if (mounted) {
        setState(() => _submitting = false);
      }
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
            SizedBox(
              height: _headerHeight,
              child: HeaderWidget(_headerHeight, true, Icons.lock_person_rounded),
            ),
            SafeArea(
              child: Container(
                padding: const EdgeInsets.fromLTRB(20, 10, 20, 10),
                margin: const EdgeInsets.fromLTRB(20, 0, 20, 10),
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
                    const SizedBox(height: 25.0),

                    // In-page error banner
                    if (_errorMessage != null)
                      Container(
                        margin: const EdgeInsets.only(bottom: 20.0),
                        padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 12.0),
                        decoration: BoxDecoration(
                          color: Colors.red.shade50,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: Colors.red.shade200, width: 1),
                        ),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Icon(Icons.error_outline_rounded, color: Colors.red.shade700, size: 22),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Text(
                                _errorMessage!,
                                style: TextStyle(
                                  color: Colors.red.shade900,
                                  fontSize: 13.5,
                                  fontWeight: FontWeight.w500,
                                  height: 1.3,
                                ),
                              ),
                            ),
                            const SizedBox(width: 6),
                            GestureDetector(
                              onTap: () => setState(() => _errorMessage = null),
                              child: Icon(Icons.close, color: Colors.red.shade400, size: 18),
                            ),
                          ],
                        ),
                      ),

                    Form(
                      key: _formKey,
                      child: Column(
                        children: [
                          Container(
                            decoration: ThemeHelper().inputBoxDecorationShaddow(),
                            child: TextField(
                              controller: useremailcontroller,
                              style: const TextStyle(color: Colors.black),
                              textInputAction: TextInputAction.next,
                              onChanged: (_) {
                                if (_errorMessage != null) {
                                  setState(() => _errorMessage = null);
                                }
                              },
                              decoration: InputDecoration(
                                labelText: 'Username / Email',
                                hintText: 'Enter your username (e.g. praveen)',
                                fillColor: Colors.white,
                                filled: true,
                                prefixIcon: Icon(Icons.person_outline, color: primaryColor),
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
                          const SizedBox(height: 20.0),
                          Container(
                            decoration: ThemeHelper().inputBoxDecorationShaddow(),
                            child: TextField(
                              controller: userpasswordcontroller,
                              style: const TextStyle(color: Colors.black),
                              obscureText: !_showPassword,
                              textInputAction: TextInputAction.done,
                              onSubmitted: (_) => login(),
                              onChanged: (_) {
                                if (_errorMessage != null) {
                                  setState(() => _errorMessage = null);
                                }
                              },
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
                                  offset: const Offset(0, 4),
                                )
                              ],
                            ),
                            child: ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.transparent,
                                shadowColor: Colors.transparent,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                              onPressed: _submitting ? null : login,
                              child: _submitting
                                  ? const Row(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        SizedBox(
                                          width: 18,
                                          height: 18,
                                          child: CircularProgressIndicator(
                                            strokeWidth: 2,
                                            valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                          ),
                                        ),
                                        SizedBox(width: 12),
                                        Text(
                                          'SIGNING IN…',
                                          style: TextStyle(
                                            fontSize: 15,
                                            fontWeight: FontWeight.bold,
                                            color: Colors.white,
                                          ),
                                        ),
                                      ],
                                    )
                                  : const Text(
                                      'SIGN IN',
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.white,
                                      ),
                                    ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
