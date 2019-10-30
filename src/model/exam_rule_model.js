const exam_rule_model={
    "title": "exam_rule",
    "description": "exam_rules before attending exam",
    "type": "object",
    "properties": {
   
      "rule_name": { "type": "string",  "maxLength":190 },
      "priority": { "type": "string" , "maxLength": 10},
      "created_by": { "type": "string" ,  "maxLength": 60},
      "updated_by": { "type": "string" ,  "maxLength": 60},
    },
   
  }
  
  export default exam_rule_model;
  