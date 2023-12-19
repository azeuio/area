import 'package:area_mobile/services/authentication_service.dart';
import 'package:area_mobile/widgets/generic_button.dart';
import 'package:area_mobile/widgets/generic_text_field.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class ForgotPasswordView extends StatefulWidget {
  const ForgotPasswordView({Key? key}) : super(key: key);

  @override
  State<ForgotPasswordView> createState() => _ForgotPasswordViewState();
}

class _ForgotPasswordViewState extends State<ForgotPasswordView> {
  TextEditingController emailController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      body: SingleChildScrollView(
        keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
        child: Padding(
          padding: const EdgeInsets.all(30),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              SizedBox(height: MediaQuery.of(context).size.height * 0.09),
              SvgPicture.asset(
                "assets/area_logo.svg",
                height: 110,
                width: 110,
              ),
              const Text(
                'Area',
                style: TextStyle(
                  fontSize: 30,
                ),
              ),
              SizedBox(height: MediaQuery.of(context).size.height * 0.05),
              const Text("Forgot your password?",
                  style: TextStyle(
                    fontSize: 30,
                  ),
                  textAlign: TextAlign.center),
              SizedBox(height: MediaQuery.of(context).size.height * 0.015),
              const Text(
                "Enter your email below to receive an email to reset your password",
                style: TextStyle(
                  color: Color(0xFF8E8E93),
                ),
                textAlign: TextAlign.center,
              ),
              SizedBox(height: MediaQuery.of(context).size.height * 0.03),
              CustomTextField(
                outlineColor: const Color(0xFFD9D9D9),
                hintText: "email",
                hintTextColor: const Color(0xFF8E8E93),
                controller: emailController,
                obscureText: false,
              ),
              SizedBox(height: MediaQuery.of(context).size.height * 0.015),
              CustomButton(
                color: const Color(0xFF2EBD59),
                text: "Send Email",
                textColor: const Color(0xFFFFFFFF),
                onPressed: () async {
                  await AuthenticationService()
                      .sendForgotPasswordEmail(context, emailController.text);
                },
                icon: Icons.arrow_forward,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
