import 'package:area_mobile/services/authentication_service.dart';
import 'package:area_mobile/views/forgot_password_view.dart';
import 'package:area_mobile/views/register_view.dart';
import 'package:area_mobile/widgets/generic_button.dart';
import 'package:area_mobile/widgets/generic_text_field.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class LoginView extends StatefulWidget {
  const LoginView({Key? key}) : super(key: key);

  @override
  State<LoginView> createState() => _LoginViewState();
}

class _LoginViewState extends State<LoginView> {
  TextEditingController emailController = TextEditingController();
  TextEditingController passwordController = TextEditingController();

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
              CustomTextField(
                outlineColor: const Color(0xFFD9D9D9),
                hintText: "email",
                hintTextColor: const Color(0xFF8E8E93),
                controller: emailController,
                obscureText: false,
              ),
              SizedBox(height: MediaQuery.of(context).size.height * 0.015),
              CustomTextField(
                outlineColor: const Color(0xFFD9D9D9),
                hintText: "password",
                hintTextColor: const Color(0xFF8E8E93),
                controller: passwordController,
                obscureText: true,
              ),
              SizedBox(height: MediaQuery.of(context).size.height * 0.015),
              CustomButton(
                color: const Color(0xFF2EBD59),
                text: "Log in",
                textColor: const Color(0xFFFFFFFF),
                onPressed: () async {
                  await AuthenticationService().loginWithEmailAndPassword(
                    context,
                    emailController.text,
                    passwordController.text,
                  );
                },
                icon: Icons.arrow_forward,
              ),
              SizedBox(height: MediaQuery.of(context).size.height * 0.01),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  InkWell(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const ForgotPasswordView(),
                        ),
                      );
                    },
                    child: const Text("Forgot your password?"),
                  ),
                ],
              ),
              SizedBox(height: MediaQuery.of(context).size.height * 0.03),
              const Text("Or"),
              SizedBox(height: MediaQuery.of(context).size.height * 0.03),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  InkWell(
                    onTap: () async {
                      await AuthenticationService().loginWithGoogle(
                        context,
                      );
                    },
                    child: Container(
                      width: MediaQuery.of(context).size.width * 0.16,
                      height: MediaQuery.of(context).size.width * 0.16,
                      decoration: BoxDecoration(
                        color: const Color(0xFFD9D9D9),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Center(
                        child: SvgPicture.asset(
                          "assets/google_logo.svg",
                          height: 30,
                          width: 30,
                        ),
                      ),
                    ),
                  ),
                  SizedBox(width: MediaQuery.of(context).size.width * 0.04),
                  InkWell(
                    onTap: () {
                      AuthenticationService().loginWithGithub(
                        context,
                      );
                    },
                    child: Container(
                      width: MediaQuery.of(context).size.width * 0.16,
                      height: MediaQuery.of(context).size.width * 0.16,
                      decoration: BoxDecoration(
                        color: const Color(0xFFD9D9D9),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Center(
                        child: SvgPicture.asset(
                          "assets/github_logo.svg",
                          height: 35,
                          width: 35,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              SizedBox(height: MediaQuery.of(context).size.height * 0.07),
              InkWell(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const RegisterView(),
                    ),
                  );
                },
                child: const Text("Don't have an account? Register"),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
