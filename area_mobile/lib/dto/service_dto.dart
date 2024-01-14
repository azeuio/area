class ServiceDto {
  String name;
  String color;
  String logo;
  String id;

  ServiceDto({required this.name, required this.color, required this.logo, required this.id});

  factory ServiceDto.fromJson(Map<String, dynamic> json) {
    return ServiceDto(
      name: json['name'],
      color: json['color'],
      logo: json['logo'],
      id: json['id'],
    );
  }
}
