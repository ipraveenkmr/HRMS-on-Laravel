import 'package:hrms/door/widgets/cdotcomponents.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:hrms/door/widgets/header_widget.dart';
import 'package:location/location.dart' as loc;
import 'package:shared_preferences/shared_preferences.dart';
import '../constants.dart';

class ProfilePage extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    return _ProfilePageState();
  }
}

class _ProfilePageState extends State<ProfilePage> {
  final loc.Location location = loc.Location();
  String longitude = "";
  String latitude = "";
  String username = "";
  String e_id = "";
  String e_name = "";
  String e_phone = "";
  String e_email = "";
  String e_type = "";
  String e_workmode = "";
  String e_department = "";

  @override
  void initState() {
    super.initState();
    _getUserData();
  }

  _getUserData() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    if (mounted) {
      setState(() {
        e_id = prefs.getString('empid')?.toString() ?? '101';
        username = prefs.getString('username') ?? 'admin@company.com';
        e_name = prefs.getString('empname') ?? 'John Administrator';
        e_phone = prefs.getString('empphone') ?? '+91 9876543210';
        e_email = prefs.getString('empemail') ?? 'admin@company.com';
        e_type = prefs.getString('emptype') ?? 'Permanent';
        e_workmode = prefs.getString('empworkmode') ?? 'Office';
        e_department = prefs.getString('empdepartment') ?? 'IT Operations';
      });
    }
  }

  String _getInitials(String name) {
    if (name.isEmpty) return "HR";
    final parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  }

  @override
  Widget build(BuildContext context) {
    final primaryColor = Theme.of(context).primaryColor;
    final accentColor = Theme.of(context).colorScheme.secondary;
    final initials = _getInitials(e_name);

    return Scaffold(
      backgroundColor: Colors.grey.shade100,
      appBar: AppBar(
        title: Text(
          "My Profile",
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        elevation: 0,
        iconTheme: IconThemeData(color: Colors.white),
        flexibleSpace: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [primaryColor, accentColor],
            ),
          ),
        ),
      ),
      drawer: CdotComponents.sidenav(),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Column(
          children: [
            // Upper Profile Header Card
            Container(
              width: double.infinity,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [primaryColor, accentColor],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
                borderRadius: const BorderRadius.only(
                  bottomLeft: Radius.circular(32),
                  bottomRight: Radius.circular(32),
                ),
              ),
              padding: const EdgeInsets.symmetric(vertical: 30),
              child: Column(
                children: [
                  // Circular initials avatar
                  Container(
                    width: 90,
                    height: 90,
                    decoration: BoxDecoration(
                      color: Colors.white24,
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white, width: 3),
                    ),
                    child: Center(
                      child: Text(
                        initials,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 32,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 15),
                  Text(
                    e_name,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      "$e_workmode Mode  •  $e_type",
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Personal Info Card
                  Text(
                    "Contact Details",
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.grey.shade800,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Card(
                    elevation: 1,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                      side: BorderSide(color: Colors.grey.shade200),
                    ),
                    child: Column(
                      children: [
                        ListTile(
                          leading: Icon(Icons.email_outlined, color: primaryColor),
                          title: const Text("Email Address", style: TextStyle(fontSize: 12, color: Colors.grey)),
                          subtitle: Text(e_email, style: const TextStyle(fontWeight: FontWeight.w600, color: Colors.black87)),
                        ),
                        Divider(height: 1, color: Colors.grey.shade100),
                        ListTile(
                          leading: Icon(Icons.phone_android_outlined, color: primaryColor),
                          title: const Text("Phone Number", style: TextStyle(fontSize: 12, color: Colors.grey)),
                          subtitle: Text(e_phone, style: const TextStyle(fontWeight: FontWeight.w600, color: Colors.black87)),
                        ),
                        Divider(height: 1, color: Colors.grey.shade100),
                        ListTile(
                          leading: Icon(Icons.person_outline, color: primaryColor),
                          title: const Text("User Name", style: TextStyle(fontSize: 12, color: Colors.grey)),
                          subtitle: Text(username, style: const TextStyle(fontWeight: FontWeight.w600, color: Colors.black87)),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Job details Card
                  Text(
                    "Employment Details",
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.grey.shade800,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Card(
                    elevation: 1,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                      side: BorderSide(color: Colors.grey.shade200),
                    ),
                    child: Column(
                      children: [
                        ListTile(
                          leading: Icon(Icons.badge_outlined, color: primaryColor),
                          title: const Text("Employee ID", style: TextStyle(fontSize: 12, color: Colors.grey)),
                          subtitle: Text(e_id, style: const TextStyle(fontWeight: FontWeight.w600, color: Colors.black87)),
                        ),
                        Divider(height: 1, color: Colors.grey.shade100),
                        ListTile(
                          leading: Icon(Icons.business_outlined, color: primaryColor),
                          title: const Text("Department", style: TextStyle(fontSize: 12, color: Colors.grey)),
                          subtitle: Text(e_department, style: const TextStyle(fontWeight: FontWeight.w600, color: Colors.black87)),
                        ),
                        Divider(height: 1, color: Colors.grey.shade100),
                        ListTile(
                          leading: Icon(Icons.work_outline, color: primaryColor),
                          title: const Text("Employment Type", style: TextStyle(fontSize: 12, color: Colors.grey)),
                          subtitle: Text(e_type, style: const TextStyle(fontWeight: FontWeight.w600, color: Colors.black87)),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
