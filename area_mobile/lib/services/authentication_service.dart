import 'package:area_mobile/main.dart';
import 'package:area_mobile/views/login_view.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:http/http.dart' as http;

class AuthenticationService {
  Future<void> registerWithEmailAndPassword(
    BuildContext context,
    String email,
    String password,
  ) async {
    String apiUrl = "http://127.0.0.1:8080/auth/register";
    try {
      var response = await http.post(
        Uri.parse(apiUrl),
        headers: {'Content-Type': 'application/json'},
        body: '{"email": "$email", "password": "$password"}',
      );
      if (response.statusCode != 201) {
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text(
                "Error when creating your account, please verify your informations.",
              ),
            ),
          );
          return;
        }
      }
      await FirebaseAuth.instance
          .signInWithEmailAndPassword(email: email, password: password);
      final user = FirebaseAuth.instance.currentUser;
      await user?.sendEmailVerification();
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              "Your account has been created, please check your email to verify it.",
            ),
          ),
        );
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const LoginView()),
        );
      }
    } catch (error) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              "An error happened when creating your account, please try again later.",
            ),
          ),
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
      String apiUrl = "http://127.0.0.1:8080/auth/create-user";
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
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text(
                "Error when creating your account, please verify your informations.",
              ),
            ),
          );
          return;
        }
      }
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              "Your account has been created.",
            ),
          ),
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
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              "An error happened when creating your account with Google, please try again later.",
            ),
          ),
        );
      }
    }
  }

  Future<void> registerWithGithub(
    BuildContext context,
  ) async {
    if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            "Github register is not available yet.",
          ),
        ),
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
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text(
                "Your account is not verified, please check your email.",
              ),
            ),
          );
          return;
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
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              "Error when logging in, please verify your informations.",
            ),
          ),
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
        String apiUrl = "http://127.0.0.1:8080/auth/create-user";
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
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              "Error when logging in with Google, please try again later.",
            ),
          ),
        );
      }
    }
  }

  Future<void> loginWithGithub(
    BuildContext context,
  ) async {
    if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            "Github login is not available yet.",
          ),
        ),
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
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              "If you have an account, you should have received an email to reset your password.",
            ),
          ),
        );
      }
    } catch (error) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              "Error when sending the email, please try again later.",
            ),
          ),
        );
      }
    }
  }
}
