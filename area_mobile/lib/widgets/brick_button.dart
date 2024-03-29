import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:marquee/marquee.dart';

class BrickButton extends StatelessWidget {
  final Color color;
  final String text;
  final Color textColor = Colors.white;
  final String logo;
  final VoidCallback onPressed;

  const BrickButton({
    Key? key,
    required this.color,
    required this.text,
    required this.logo,
    required this.onPressed,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        onPressed();
      },
      child: Stack(
        alignment: Alignment.center,
        children: [
          Container(
            width: 314,
            height: 87,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(10),
              color: color,
            ),
          ),
          Positioned(
            left: 50,
            top: 25,
            child: text.length < 17
                ? Text(
                    text,
                    style: TextStyle(
                      color: textColor,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  )
                : SizedBox(
                    height: 87,
                    width: 200,
                    child: Marquee(
                      text: text,
                      style: TextStyle(
                        color: textColor,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                      scrollAxis: Axis.horizontal,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      blankSpace: 50.0,
                      velocity: 50.0,
                    ),
                  ),
          ),
          Positioned(
            right: 50,
            top: 15,
            child: ClipOval(
              child: Container(
                width: 50,
                height: 50,
                color: Colors.white,
                child: SvgPicture.network(
                  logo,
                  placeholderBuilder: (context) => const CircularProgressIndicator(),
                  fit: BoxFit.contain,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
