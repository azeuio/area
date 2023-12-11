import 'package:flutter/material.dart';

class CustomButton extends StatelessWidget {
  final Color color;
  final String text;
  final Color textColor;
  final IconData? icon;
  final VoidCallback onPressed;

  const CustomButton({
    Key? key,
    required this.color,
    required this.text,
    required this.textColor,
    this.icon,
    required this.onPressed,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    MainAxisAlignment rowAlignment = MainAxisAlignment.center;

    if (icon != null) {
      rowAlignment = MainAxisAlignment.spaceBetween;
    }

    return ElevatedButton(
      onPressed: onPressed,
      style: ButtonStyle(
        backgroundColor: MaterialStateProperty.all<Color>(color),
        minimumSize: MaterialStateProperty.all<Size>(const Size(200, 75)),
        shape: MaterialStateProperty.all<RoundedRectangleBorder>(
          RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
        ),
      ),
      child: Row(
        mainAxisAlignment: rowAlignment,
        children: [
          Text(
            text,
            style: TextStyle(
              color: textColor,
              fontSize: Theme.of(context).textTheme.titleMedium?.fontSize,
              fontWeight: Theme.of(context).textTheme.titleMedium?.fontWeight,
              fontFamily: Theme.of(context).textTheme.titleMedium?.fontFamily,
            ),
          ),
          if (icon != null)
            Icon(
              icon,
              color: textColor,
              size: Theme.of(context).textTheme.titleMedium?.fontSize,
            ),
        ],
      ),
    );
  }
}
