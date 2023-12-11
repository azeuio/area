import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

final ThemeData areaTheme = ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: const Color(0xFF2EBD59),
      brightness: Brightness.light,
    ),
    textTheme: TextTheme(
      titleLarge: GoogleFonts.spaceGrotesk(
        fontSize: 30,
        fontWeight: FontWeight.w600,
      ),
      titleMedium: GoogleFonts.spaceGrotesk(
        fontSize: 30,
        fontWeight: FontWeight.w500,
      ),
      bodyMedium: GoogleFonts.spaceGrotesk(
        fontSize: 20,
        fontWeight: FontWeight.w500,
      ),
      bodySmall: GoogleFonts.spaceGrotesk(
        fontSize: 20,
        fontWeight: FontWeight.w400,
      ),
    ));
