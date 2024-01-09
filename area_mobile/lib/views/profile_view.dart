// ignore_for_file: avoid_print

import 'package:area_mobile/views/login_view.dart';
import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';

import 'package:area_mobile/views/update_settings_view.dart';
import 'package:area_mobile/widgets/generic_button.dart';
import 'package:area_mobile/services/global_service.dart';

class ProfileView extends StatefulWidget {
  const ProfileView({Key? key}) : super(key: key);

  @override
  State<ProfileView> createState() => _ProfileViewState();
}

class _ProfileViewState extends State<ProfileView> {
  String username = "Not found";
  User? user;
  Map<String, dynamic>? userData;

  @override
  void initState() {
    super.initState();
    getCurrentUser().then((User? user) {
      setState(() {
        this.user = user;
      });
      getUserData(user).then((Map<String, dynamic>? userData) {
        setState(() {
          this.userData = userData;
          username = userData?["username"] ?? "Not found";
        });
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(30),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                username,
                style: const TextStyle(
                  fontSize: 30,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 32),
              CustomButton(
                color: Colors.grey,
                text: "Settings",
                textColor: Colors.black,
                onPressed: () {
                  Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const UpdateSettingsView(),
                        ),
                      );
                },
                icon: Icons.settings
              ),
              const SizedBox(height: 16),
              CustomButton(
                color: Colors.grey,
                text: "Services",
                textColor: Colors.black,
                onPressed: () async {
                  print("Services pressed");
                },
              ),
              const SizedBox(height: 16),
              CustomButton(
                color: Colors.red,
                text: 'Log out',
                textColor: Colors.white,
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const LoginView(),
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
