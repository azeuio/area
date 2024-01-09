import 'package:flutter/material.dart';

class CustomTextField extends StatefulWidget {
  final Color outlineColor;
  final String hintText;
  final Color hintTextColor;
  final TextEditingController controller;
  final TextInputType keyboardType;
  final bool obscureText;
  final String? initialText;

  const CustomTextField({
    Key? key,
    required this.outlineColor,
    required this.hintText,
    required this.hintTextColor,
    required this.controller,
    this.keyboardType = TextInputType.text,
    required this.obscureText,
    this.initialText,
  }) : super(key: key);

  @override
  State<CustomTextField> createState() => _CustomTextFieldState();
}

class _CustomTextFieldState extends State<CustomTextField> {
  bool isPasswordVisible = false;

  @override
  void initState() {
    super.initState();
    if (widget.initialText != null) {
      widget.controller.text = widget.initialText!;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(10),
        border: Border.all(
          color: widget.outlineColor,
          width: 3,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 15),
        child: TextField(
          controller: widget.controller,
          keyboardType: widget.keyboardType,
          obscureText: !isPasswordVisible && widget.obscureText,
          style: TextStyle(
            fontSize: Theme.of(context).textTheme.bodyMedium?.fontSize,
            fontWeight: Theme.of(context).textTheme.bodyMedium?.fontWeight,
            fontFamily: Theme.of(context).textTheme.bodyMedium?.fontFamily,
          ),
          decoration: InputDecoration(
            hintText: widget.hintText,
            hintStyle: TextStyle(
              color: widget.hintTextColor,
              fontSize: Theme.of(context).textTheme.bodyMedium?.fontSize,
              fontWeight: Theme.of(context).textTheme.bodyMedium?.fontWeight,
              fontFamily: Theme.of(context).textTheme.bodyMedium?.fontFamily,
            ),
            border: InputBorder.none,
            suffixIcon: widget.obscureText
                ? IconButton(
                    icon: Icon(
                      isPasswordVisible
                          ? Icons.visibility_off
                          : Icons.visibility,
                    ),
                    onPressed: () {
                      setState(() {
                        isPasswordVisible = !isPasswordVisible;
                      });
                    },
                  )
                : null,
          ),
        ),
      ),
    );
  }
}
