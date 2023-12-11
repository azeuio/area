import 'package:flutter/material.dart';

class CustomBottomNavigationBar extends StatefulWidget {
  final Function(int) onItemTapped;
  final int selectedItem;

  const CustomBottomNavigationBar({
    Key? key,
    required this.onItemTapped,
    required this.selectedItem,
  }) : super(key: key);

  @override
  State<CustomBottomNavigationBar> createState() =>
      _CustomBottomNavigationBarState();
}

class _CustomBottomNavigationBarState extends State<CustomBottomNavigationBar> {
  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      items: const [
        BottomNavigationBarItem(
          icon: Icon(Icons.dashboard_rounded),
          label: 'Boards',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.bolt_rounded),
          label: 'Areas',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.account_circle_sharp),
          label: 'Profile',
        ),
      ],
      currentIndex: widget.selectedItem,
      onTap: widget.onItemTapped,
    );
  }
}
