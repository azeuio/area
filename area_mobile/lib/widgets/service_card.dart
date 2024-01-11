import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class ServiceCard extends StatefulWidget {
  final Color color;
  final String name;
  final String logoPath;
  final bool colored;
  final VoidCallback? onPressed;

  const ServiceCard({
    Key? key,
    required this.color,
    required this.name,
    required this.logoPath,
    required this.colored,
    this.onPressed,
  }) : super(key: key);

  @override
  State<ServiceCard> createState() => _ServiceCardState();
}

class _ServiceCardState extends State<ServiceCard> {
  bool isSelected = false;

  @override
  Widget build(BuildContext context) {
    if (widget.colored) {
      isSelected = true;
    }
    return GestureDetector(
      onTap: () {
        if (widget.colored) {
          widget.onPressed?.call();
          return;
        } else {
          setState(() {
            isSelected = !isSelected;
          });
        }
      },
      child: Container(
        width: MediaQuery.of(context).size.width * 0.37,
        height: MediaQuery.of(context).size.width * 0.37,
        decoration: BoxDecoration(
          color: isSelected ? widget.color : Colors.grey,
          borderRadius: BorderRadius.circular(10),
        ),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: MediaQuery.of(context).size.width * 0.15,
                height: MediaQuery.of(context).size.width * 0.15,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(
                      MediaQuery.of(context).size.width * 0.1),
                ),
                child: Center(
                  child: SizedBox(
                    width: MediaQuery.of(context).size.width * 0.1,
                    height: MediaQuery.of(context).size.width * 0.1,
                    child: ColorFiltered(
                      colorFilter: ColorFilter.mode(
                        isSelected ? Colors.transparent : Colors.transparent,
                        BlendMode.saturation,
                      ),
                      child: SvgPicture.network(
                        widget.logoPath,
                        placeholderBuilder: (context) =>
                            CircularProgressIndicator(),
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              Text(
                widget.name,
                style: TextStyle(
                  color: Colors.white,
                  fontSize: MediaQuery.of(context).size.width * 0.045,
                  fontWeight:
                      Theme.of(context).textTheme.bodyMedium?.fontWeight,
                  fontFamily:
                      Theme.of(context).textTheme.bodyMedium?.fontFamily,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
