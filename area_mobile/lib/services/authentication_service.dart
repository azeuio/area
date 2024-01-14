import 'package:area_mobile/main.dart';
import 'package:area_mobile/views/login_view.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:http/http.dart' as http;
import 'package:area_mobile/constants.dart';

class AuthenticationService {
  void showAlertDialog(BuildContext context, String title, String message) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(title),
          content: Text(message),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('OK'),
            ),
          ],
        );
      },
    );
  }

  Future<void> registerWithEmailAndPassword(
    BuildContext context,
    String email,
    String password,
  ) async {
    String apiUrl = "${AppConstants.apiUrl}/auth/register";
    try {
      var response = await http.post(
        Uri.parse(apiUrl),
        headers: {'Content-Type': 'application/json'},
        body: '{"email": "$email", "password": "$password"}',
      );
      if (response.statusCode != 201) {
        if (context.mounted) {
          showAlertDialog(
            context,
            "Error",
            "An error happened when creating your account, please verify your informations.",
          );
          return;
        }
      }
      await FirebaseAuth.instance
          .signInWithEmailAndPassword(email: email, password: password);
      final user = FirebaseAuth.instance.currentUser;
      await user?.sendEmailVerification();
      if (context.mounted) {
        showAlertDialog(
          context,
          "Info",
          "Your account has been created, please verify your email.",
        );
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const LoginView()),
        );
      }
    } catch (error) {
      if (context.mounted) {
        showAlertDialog(
          context,
          "Error",
          "An error happened when creating your account, please try again later.",
        );
      }
    }
  }

  Future<void> registerWithGoogle(
    BuildContext context,
  ) async {
    try {
      final GoogleSignInAccount? googleUser = await GoogleSignIn().signIn();
      final GoogleSignInAuthentication? googleAuth =
          await googleUser?.authentication;
      final credential = GoogleAuthProvider.credential(
        accessToken: googleAuth?.accessToken,
        idToken: googleAuth?.idToken,
      );
      await FirebaseAuth.instance.signInWithCredential(credential);
      String apiUrl = "${AppConstants.apiUrl}/auth/create-user";
      var userToken = await FirebaseAuth.instance.currentUser?.getIdToken();
      var username = googleUser?.displayName;
      var response = await http.post(
        Uri.parse(apiUrl),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $userToken',
        },
        body: '{"username": "$username"}',
      );
      if (response.statusCode != 200) {
        if (context.mounted) {
          showAlertDialog(
            context,
            "Error",
            "An error happened when creating your account, please verify your informations.",
          );
          return;
        }
      }
      if (context.mounted) {
        showAlertDialog(
          context,
          "Info",
          "Your account has been created.",
        );
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => const HomePage(
              title: 'Boards',
            ),
          ),
        );
      }
    } catch (error) {
      if (context.mounted) {
        showAlertDialog(
          context,
          "Error",
          "An error happened when creating your account, please try again later.",
        );
      }
    }
  }

  Future<void> registerWithGithub(
    BuildContext context,
  ) async {
    if (context.mounted) {
      showAlertDialog(
        context,
        "Error",
        "Registering with Github is not available yet.",
      );
    }
  }

  Future<void> loginWithEmailAndPassword(
    BuildContext context,
    String email,
    String password,
  ) async {
    try {
      var result = await FirebaseAuth.instance
          .signInWithEmailAndPassword(email: email, password: password);
      if (result.user?.emailVerified == false) {
        if (context.mounted) {
          showAlertDialog(
            context,
            "Error",
            "Your account is not verified, please check your emails.",
          );
        }
      }
      if (context.mounted) {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => const HomePage(title: 'Boards'),
          ),
        );
      }
    } catch (error) {
      if (context.mounted) {
        showAlertDialog(
          context,
          "Error",
          "An error happened when logging in, please verify your informations.",
        );
      }
    }
  }

  Future<void> loginWithGoogle(
    BuildContext context,
  ) async {
    try {
      final GoogleSignInAccount? googleUser = await GoogleSignIn().signIn();
      final GoogleSignInAuthentication? googleAuth =
          await googleUser?.authentication;
      final credential = GoogleAuthProvider.credential(
        accessToken: googleAuth?.accessToken,
        idToken: googleAuth?.idToken,
      );
      var result = await FirebaseAuth.instance.signInWithCredential(credential);
      if (result.additionalUserInfo!.isNewUser == true) {
        String apiUrl = "${AppConstants.apiUrl}/auth/create-user";
        var userToken = await FirebaseAuth.instance.currentUser?.getIdToken();
        var username = googleUser?.displayName;
        await http.post(
          Uri.parse(apiUrl),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $userToken',
          },
          body: '{"username": "$username"}',
        );
      }
      if (context.mounted) {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => const HomePage(title: 'Boards'),
          ),
        );
      }
    } catch (error) {
      if (context.mounted) {
        showAlertDialog(
          context,
          "Error",
          "An error happened when logging in with Google, please try again later.",
        );
      }
    }
  }

  Future<void> loginWithGithub(
    BuildContext context,
  ) async {
    if (context.mounted) {
      showAlertDialog(
        context,
        "Error",
        "Login with Github is not available yet.",
      );
    }
  }

  Future<void> sendForgotPasswordEmail(
    BuildContext context,
    String email,
  ) async {
    try {
      await FirebaseAuth.instance.sendPasswordResetEmail(
        email: email,
      );
      if (context.mounted) {
        showAlertDialog(
          context,
          "Info",
          "If you have an account, you should have received an email to reset your password.",
        );
      }
    } catch (error) {
      if (context.mounted) {
        showAlertDialog(
          context,
          "Error",
          "An error happened when sending the email, please verify your informations.",
        );
      }
    }
  }
}
