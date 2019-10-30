const post_model = {
"title":"post model ",
"description":"handle questions according to post",
"type":"object",
"properties":{
  "post_name":{"type":"string", "maxLength":30},
  "created_by":{"type":"string", "maxLength":60},
  "threshold":{"type":"number", "minLength":1},
  "updated_by":{"type":"string", "maxLength":60}
},
}

export default post_model;