import 'package:dio/dio.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../constants.dart';
import '../door/widgets/cdotcomponents.dart';
import '../door/widgets/header_widget.dart';
import '../common/api_client.dart';

class AssetPage extends StatefulWidget {
  const AssetPage({Key? key}) : super(key: key);

  @override
  State<AssetPage> createState() => _AssetPageState();
}

class _AssetPageState extends State<AssetPage> {
  List users = [];
  String link = AppConstants.apiLink;
  String e_id = "";

  @override
  void initState() {
    super.initState();
    getUsers().then((data) {
      if (mounted) {
        setState(() {
          users = data ?? [];
        });
      }
    });
  }

  getUsers() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String username = prefs.getString('username')?.toString() ?? '';
    if (username.isEmpty) return [];
    var response = await ApiClient.client.get(link + "assets-allocations/employee/" + username);
    return response.data;
  }

  Widget buildText(String text) => Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 20.0),
          child: Text(
            text,
            style: TextStyle(fontSize: 16, color: Colors.grey.shade600),
          ),
        ),
      );

  IconData _getAssetIcon(String assetName) {
    final name = assetName.toLowerCase();
    if (name.contains('macbook') || name.contains('laptop') || name.contains('dell')) {
      if (name.contains('monitor')) return Icons.monitor_outlined;
      return Icons.laptop_chromebook_outlined;
    } else if (name.contains('iphone') || name.contains('phone')) {
      return Icons.phone_iphone_outlined;
    } else if (name.contains('keyboard')) {
      return Icons.keyboard_alt_outlined;
    } else if (name.contains('mouse')) {
      return Icons.mouse_outlined;
    } else if (name.contains('headset') || name.contains('headphones')) {
      return Icons.headset_mic_outlined;
    } else if (name.contains('chair')) {
      return Icons.chair_alt_outlined;
    } else if (name.contains('desk')) {
      return Icons.desk_outlined;
    } else if (name.contains('card') || name.contains('id')) {
      return Icons.badge_outlined;
    } else if (name.contains('key') || name.contains('yubikey')) {
      return Icons.key_outlined;
    }
    return Icons.devices_other_outlined;
  }

  @override
  Widget build(BuildContext context) {
    final primaryColor = Theme.of(context).primaryColor;
    final accentColor = Theme.of(context).colorScheme.secondary;

    return Scaffold(
      backgroundColor: Colors.grey.shade100,
      appBar: AppBar(
        title: Text(
          "My Assets",
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
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    "Allocated Hardware & Assets",
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.grey.shade800),
                  ),
                  if (AppConstants.dummyMode)
                    Text(
                      "Dummy Mode Active",
                      style: TextStyle(fontSize: 11, color: Colors.amber.shade800, fontWeight: FontWeight.w600),
                    ),
                ],
              ),
              const SizedBox(height: 12),
              FutureBuilder(
                future: getUsers(),
                builder: (context, AsyncSnapshot snapshot) {
                  switch (snapshot.connectionState) {
                    case ConnectionState.waiting:
                      return const Center(
                        child: Padding(
                          padding: EdgeInsets.symmetric(vertical: 30.0),
                          child: CircularProgressIndicator(),
                        ),
                      );
                    default:
                      if (snapshot.hasError) {
                        return buildText('Something Went Wrong Try later');
                      }
                      if (!snapshot.hasData || users.isEmpty) {
                        return buildText('No Allocated Assets Found');
                      }
                      
                      return ListView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: users.length,
                          itemBuilder: (BuildContext context, int index) {
                            final asset = users[index];
                            final assetName = asset['asset']?.toString() ?? 'Company Asset';

                            String allocDate = 'N/A';
                            String returnDate = 'N/A';
                            try {
                              if (asset['allocation_date'] != null) {
                                allocDate = DateFormat('MMM d, yyyy')
                                    .format(DateTime.parse(asset['allocation_date']));
                              }
                              if (asset['return_date'] != null) {
                                returnDate = DateFormat('MMM d, yyyy')
                                    .format(DateTime.parse(asset['return_date']));
                              }
                            } catch (_) {}

                            return Card(
                              elevation: 1,
                              margin: const EdgeInsets.only(bottom: 12),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                                side: BorderSide(color: Colors.grey.shade200),
                              ),
                              child: Padding(
                                padding: const EdgeInsets.all(16.0),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: <Widget>[
                                    Row(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Container(
                                          padding: const EdgeInsets.all(10),
                                          decoration: BoxDecoration(
                                            color: primaryColor.withOpacity(0.08),
                                            shape: BoxShape.circle,
                                          ),
                                          child: Icon(
                                            _getAssetIcon(assetName),
                                            color: primaryColor,
                                            size: 24,
                                          ),
                                        ),
                                        const SizedBox(width: 12),
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                assetName,
                                                style: const TextStyle(
                                                  fontSize: 16,
                                                  fontWeight: FontWeight.bold,
                                                ),
                                              ),
                                              const SizedBox(height: 4),
                                              Text(
                                                asset['description'] ?? 'No description provided.',
                                                style: TextStyle(
                                                  color: Colors.grey.shade600,
                                                  fontSize: 12,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 14),
                                    Divider(color: Colors.grey.shade100, height: 1),
                                    const SizedBox(height: 14),
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              "Allocated On",
                                              style: TextStyle(color: Colors.grey.shade500, fontSize: 11),
                                            ),
                                            const SizedBox(height: 2),
                                            Text(
                                              allocDate,
                                              style: TextStyle(
                                                fontSize: 12,
                                                fontWeight: FontWeight.bold,
                                                color: Colors.grey.shade800,
                                              ),
                                            ),
                                          ],
                                        ),
                                        Column(
                                          crossAxisAlignment: CrossAxisAlignment.end,
                                          children: [
                                            Text(
                                              "Expected Return",
                                              style: TextStyle(color: Colors.grey.shade500, fontSize: 11),
                                            ),
                                            const SizedBox(height: 2),
                                            Text(
                                              returnDate,
                                              style: TextStyle(
                                                fontSize: 12,
                                                fontWeight: FontWeight.bold,
                                                color: Colors.grey.shade800,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            );
                          });
                  }
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
