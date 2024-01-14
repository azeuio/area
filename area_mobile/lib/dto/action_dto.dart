class InputType {
  final String name;
  final String description;
  final bool optional;
  final String type;

  InputType({
    required this.name,
    required this.description,
    required this.optional,
    required this.type,
  });

  factory InputType.fromJson(Map<String, dynamic> json) {
    return InputType(
      name: json['name'],
      description: json['description'],
      optional: json['optional'],
      type: json['type'],
    );
  }
}

class ActionDto {
  final String name;
  final String description;
  final bool isATrigger;
  final String serviceId;
  final String id;

  ActionDto({
    required this.name,
    required this.description,
    required this.isATrigger,
    required this.serviceId,
    required this.id,
  });

  factory ActionDto.fromJson(Map<String, dynamic> json) {
    return ActionDto(
      name: json['name'],
      description: json['description'],
      isATrigger: json['is_a_trigger'],
      serviceId: json['service_id'],
      id: json['id'],
    );
  }
}
