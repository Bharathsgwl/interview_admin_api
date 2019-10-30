const question_model = {
    "title":"Question_Section Model ",
    "description":"handling questions ",
    "type":"object",
    "properties":{
        "post_id":{"type":"string"},
        "q_name":{"type":"string"},
         "options":{"type":"string"},
        "q_answer":{"type":"string"},
        "has_option":{"type":"boolean"},
        "q_comment":{"type":"string"},
        "created_by":{"type":"string", "maxLength":60, "minLength":3},
        "timer":{"type":"integer", "maxLength":2    },
        "updated_by":{"type":"string", "maxLength":60}
    }
} 
export default question_model;