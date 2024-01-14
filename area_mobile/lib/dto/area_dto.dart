class AreaAction {
  final String id;
  final dynamic outputs;

  AreaAction({
    required this.id,
    required this.outputs,
  });
}

class AreaDto {
  final AreaAction action;
  final String boardId;
  String? childId;

  AreaDto({
    required this.action,
    required this.boardId,
    this.childId,
  });
}

class AreaWithIdDto {
  final AreaAction action;
  final String boardId;
  final String id;
  String? childId;

  AreaWithIdDto({
    required this.action,
    required this.boardId,
    required this.id,
    this.childId,
  });
}

class CreateAreaDto {
  final AreaAction action;
  final String boardId;
  String? parentId;
  String? childId;

  CreateAreaDto({
    required this.action,
    required this.boardId,
    this.parentId,
    this.childId,
  });

  Map<String, dynamic> toJson() {
    return {
      'action': {
        'id': action.id,
        'outputs': action.outputs,
      },
      'board_id': boardId,
      'parent_id': parentId,
      'child_id': childId,
    };
  }
}
