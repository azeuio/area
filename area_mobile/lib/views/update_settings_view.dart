import 'package:area_mobile/constants.dart';
import 'package:area_mobile/main.dart';
import 'package:area_mobile/widgets/generic_button.dart';
import 'package:area_mobile/widgets/modal.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

import 'package:area_mobile/widgets/generic_text_field.dart';
import 'package:area_mobile/services/global_service.dart';
import 'package:area_mobile/services/update_settings_service.dart';

class UpdateSettingsView extends StatefulWidget {
  const UpdateSettingsView({Key? key}) : super(key: key);

  @override
  State<UpdateSettingsView> createState() => _UpdateSettingsViewState();
}

class _UpdateSettingsViewState extends State<UpdateSettingsView> {
  late Future<Map<String, dynamic>?> userDataFuture =
      getCurrentUser().then((User? user) {
    setState(() {
      this.user = user;
    });
    return getUserData(user);
  });

  TextEditingController usernameController = TextEditingController();
  TextEditingController emailController = TextEditingController();
  TextEditingController actualPasswordController = TextEditingController();
  TextEditingController newPasswordController = TextEditingController();
  User? user;
  String actualUsername = "Not found";
  String actualEmail = "Not found";
  bool userWantToDeleteAccount = false;
  UpdateSettingStatus emailStatus = UpdateSettingStatus.notUpdated;
  UpdateSettingStatus passwordStatus = UpdateSettingStatus.notUpdated;

  void onEmailModalConfirm() {
    if (passwordStatus == UpdateSettingStatus.error ||
        emailStatus == UpdateSettingStatus.error) {
      setState(() {
        emailStatus = UpdateSettingStatus.notUpdated;
      });
    } else {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => const HomePage(
            title: 'Profile',
          ),
        ),
      );
    }
  }

  void onPasswordModalConfirm() {
    setState(() {
      passwordStatus = UpdateSettingStatus.notUpdated;
    });
  }

  void onDeleteAccountModalConfirm() {
    deleteAccount(AppConstants.apiUrl, user, context);
  }

  void onDeleteAccountModalCancel() {
    setState(() {
      userWantToDeleteAccount = false;
    });
  }

  Future<void> handleSave() async {
    if (user == null) {
      return;
    }
    String userToken = await user!.getIdToken() as String;
    await tryUpdateUsername(AppConstants.apiUrl, userToken, actualUsername,
        usernameController.text);
    UpdateSettingStatus actualEmailStatus = await tryUpdateEmail(
        AppConstants.apiUrl, userToken, actualEmail, emailController.text);
    UpdateSettingStatus actualPasswordStatus = await tryUpdatePassword(
        AppConstants.apiUrl,
        actualPasswordController.text,
        newPasswordController.text);

    emailStatus = actualEmailStatus;
    passwordStatus = actualPasswordStatus;
    if (actualEmailStatus != UpdateSettingStatus.notUpdated ||
        actualPasswordStatus == UpdateSettingStatus.error) {
      if (!context.mounted) {
        return;
      }
      if (actualPasswordStatus == UpdateSettingStatus.error) {
        displayModal(
            context,
            "Error when updating your password. Please try again",
            onPasswordModalConfirm);
      }
      if (actualEmailStatus == UpdateSettingStatus.updated) {
        displayModal(
            context,
            actualEmailStatus == UpdateSettingStatus.updated
                ? "Your email has been updated. Please check your inbox to confirm your new email"
                : "Error when updating your email. Please try again.",
            onEmailModalConfirm);
      }
      return;
    }
    if (!context.mounted) {
      return;
    }
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => const HomePage(
          title: 'Profile',
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Update settings"),
      ),
      body: FutureBuilder<Map<String, dynamic>?>(
        future: userDataFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const CircularProgressIndicator();
          } else if (snapshot.hasError) {
            return Text('Error: ${snapshot.error}');
          } else {
            Map<String, dynamic>? userData = snapshot.data;
            if (userData != null) {
              actualUsername = userData["username"] ?? "Not found";
              actualEmail = userData["email"] ?? "Not found";
            }
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(30),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text(
                      "Update settings",
                      style: TextStyle(
                        fontSize: 30,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 32),
                    CustomTextField(
                      outlineColor: Colors.grey,
                      hintText: 'Username',
                      hintTextColor: Colors.grey,
                      controller: usernameController,
                      obscureText: false,
                      initialText: actualUsername,
                    ),
                    const SizedBox(height: 16),
                    CustomTextField(
                      outlineColor: Colors.grey,
                      hintText: 'Email',
                      hintTextColor: Colors.grey,
                      controller: emailController,
                      obscureText: false,
                      initialText: actualEmail,
                      keyboardType: TextInputType.emailAddress,
                    ),
                    const SizedBox(height: 16),
                    CustomTextField(
                      outlineColor: Colors.grey,
                      hintText: 'Actual Password',
                      hintTextColor: Colors.grey,
                      controller: actualPasswordController,
                      obscureText: true,
                    ),
                    const SizedBox(height: 16),
                    CustomTextField(
                      outlineColor: Colors.grey,
                      hintText: 'New Password',
                      hintTextColor: Colors.grey,
                      controller: newPasswordController,
                      obscureText: true,
                    ),
                    const SizedBox(height: 16),
                    CustomButton(
                      color: Colors.blue,
                      text: 'Save',
                      textColor: Colors.white,
                      onPressed: handleSave,
                    ),
                    const SizedBox(height: 16),
                    CustomButton(
                      color: Colors.red,
                      text: 'Delete Account',
                      textColor: Colors.white,
                      onPressed: () {
                        displayModal(
                            context,
                            "Are you sure you want to delete your account?",
                            onDeleteAccountModalConfirm,
                            onCancel: onDeleteAccountModalCancel);
                      },
                      icon: Icons.warning_amber_rounded,
                    ),
                  ],
                ),
              ),
            );
          }
        },
      ),
    );
  }
}
