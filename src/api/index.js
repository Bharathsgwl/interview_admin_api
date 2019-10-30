import { version } from "../../package.json";
import { Router } from "express";
import Ajv from "ajv";
import exam_rule_model from "../model/exam_rule_model";
import post_model from "../model/post_model";
import question_model from "../model/question_model";
import candidate_post_map from "../model/candidate_post_map";

var ajv = new Ajv();
export default ({ config, db }) => {
  let api = Router();

  // checking user has attended test or not
  api.post("/user_checking", (req, res) => {
    const { user_id } = req.body;

    let flag;
    db.query("SELECT * from result", (err, response) => {
      if (err) {
        console.log(err.stack);
      } else {
        console.log(response.rows, "response");

        response.rows.forEach((user, index) => {
          if (user.r_user_id === user_id) {
            flag = false;
          } else {
            flag = true;
          }
        });
        if (flag == false) {
          console.log({ name: "User exist" });
          res.json({ name: "User exist" });
        } else {
          console.log({ name: "Welcome User" });
          res.json({ name: "Welcome User" });
        }
      }
    });
  });

  api.get("/candidate_post_maps", (req, res) => {
    //find all in candidate_post_map table and return the candidate_post_map
    const { user_id } = req.query;

    console.log(req.query, "req");
    let q_length;
    db.query(
      `SELECT uuid,post_id from candidate_post_map  where user_id='${user_id}'`,
      (err, response) => {
        if (err) {
          console.log(err.message);
          res.json({ err: err.message });
        } else {
          console.log(response.rows);
          q_length = response.rows[0].post_id;
          console.log(q_length, "post_id");
          let abc = percentage(q_length);
          res.json({ posts: response.rows });
        }
      }
    );
  });

  //post(Developer post_name) api**************************************************************************************

  //get method

  api.get("/post", (req, res) => {
    db.query("SELECT * from post where status=true", (err, response) => {
      if (err) {
        console.log(err.stack);
      } else {
        console.log(response.rows);
        res.json({ posts: response.rows });
      }
    });
  });

  // get method with id
  api.get("/post/:uuid", (req, res) => {
    console.log(req.params.uuid, "uuid");
    db.query(
      `SELECT * from post where uuid='${req.params.uuid}'`,
      (err, response) => {
        if (err) {
          console.log(err.stack);
        } else {
          res.json({ post: response.rows });
        }
      }
    );
  });

  //post  method
  api.post("/post", (req, res) => {
    const { post_name, created_by, threshold } = req.body;
    var validate = ajv.compile(post_model);
    var valid = validate(req.body);
    if (!valid) {
      console.log(validate.errors);
      return next({ Errors: validate.errors });
    }

    const created_time = new Date().getTime();
    console.log(created_time);
    db.query(
      `insert into post values('${uuid}','${post_name}',true,'${threshold}','${created_by}','${created_time}')`,
      (err, response) => {
        if (err) {
          console.log(err.stack);
        } else {
          console.log(response.rows);
          res.json({ status: "successfull", post: response.rows });
        }
      }
    );
  });

  //put method
  api.put("/post", (req, res) => {
    const { uuid, post_name, updated_by, threshold } = req.body;
    var validate = ajv.compile(post_model);
    var valid = validate(req.body);
    if (!valid) {
      console.log(validate.errors);
      return next({ Errors: validate.errors });
    }
    const updated_time = new Date().getTime();
    db.query(
      `UPDATE post set post_name='${post_name}',threshold=${threshold},updated_by='${updated_by}',updated_time='${updated_time}' where uuid='${uuid}'`
    );
    res.json({ version, status: "live", method: "put" });
  });

  //delete method
  api.delete("/post/:uuid", (req, res) => {
    console.log("req", req.params);

    db.query(`update post set status=false where uuid='${req.params.uuid}'`);
    res.json({ version, status: "live", method: "delete" });
  });

  //Question Section Table api *****************************************************************************************************************************************************

  //post method

  api.post("/question_section", (req, res) => {
    const {
      q_uuid,
      post_id,
      q_name,
      options,
      q_answer,
      has_option,
      q_comment,
      created_by,
      timer
    } = req.body;
    var validate = ajv.compile(question_model);
    var valid = validate(req.body);
    if (!valid) {
      console.log(validate.errors);
      return next({ Errors: validate.errors });
    }

    const created_time = new Date().getTime();

    db.query(
      `insert into question_section values('${q_uuid}','${post_id}','${q_name}','${options}','${q_answer}',${has_option},'${q_comment}',true,'${created_by}','${created_time}', null, null, '${timer}')`,
      (err, response) => {
        if (err) {
          console.log(err.stack);
        } else {
          res.json({ status: "Question Inserted", response: response.rows });
        }
      }
    );
  });

  //get method for all questions
  api.get("/question_section", (req, res) => {
    db.query(
      "SELECT *  from question_section where status=true",
      (err, response) => {
        if (err) {
          console.log(err.stack);
        } else {
          res.json({ questions: response.rows });
        }
      }
    );
  });

  //get method for given post_id
  api.get("/question_sections", (req, res) => {
    const { post_id } = req.query;
    db.query(
      `SELECT q_uuid,q_name,options,timer from  question_section where status=true AND post_id='${post_id}'`,
      (err, response) => {
        if (err) {
          console.log(err.stack);
        } else {
          res.json({ questions: response.rows });
        }
      }
    );
  });

  //get method for given question id
  api.get("/question_section/:q_uuid", (req, res) => {
    db.query(
      `SELECT * from question_section where q_uuid='${req.params.q_uuid}' where status= true`,
      (err, response) => {
        if (err) {
          console.log(err.stack);
        } else {
          console.log(response.rows);
          res.json({ question: response.rows });
        }
      }
    );
  });

  //put method for given q_uuid
  api.put("/question_section", (req, res) => {
    const {
      q_uuid,
      post_id,
      q_name,
      options,
      q_answer,
      has_option,
      q_comment,
      updated_by,
      timer
    } = req.body;
    var validate = ajv.compile(question_model);
    var valid = validate(req.body);
    if (!valid) {
      console.log(validate.errors);
      return next({ Errors: validate.errors });
    }
    const updated_time = new Date().getTime();
    db.query(
      `UPDATE question_section set post_id='${post_id}',q_name='${q_name}',options='${options}',q_answer='${q_answer}',has_option='${has_option}',q_comment='${q_comment}',updated_by='${updated_by}',updated_time='${updated_time}',timer=${timer} where q_uuid='${q_uuid}'`
    );
    res.json("Question Updated");
  });

  //delete method
  api.delete("/question_section/:q_uuid", (req, res) => {
    db.query(
      `update question_section set status=false where q_uuid='${req.params.q_uuid}'`
    );
    res.json("Question Deleted");
  });

  //Exam Rules (Instruction) api ***********************************************************************************************************************************

  //post method

  api.post("/exam_rules", (req, res) => {
    //take posts from req and insert into posts table
    const { uuid, rule_name, priority, created_by } = req.body;

    //validation
    var validate = ajv.compile(exam_rule_model);
    var valid = validate(req.body);
    if (!valid) {
      console.log("exam_rule, post method", validate.errors);
      return next({ Errors: validate.errors });
    }

    const created_time = new Date().getTime();
    console.log(created_time);
    db.query(
      `insert into exam_rules values('${uuid}','${rule_name}','${priority}',true,'${created_by}','${created_time}',null,null)`,
      (err, response) => {
        if (err) {
          console.log(err.stack);
        } else {
          console.log(response.rows);
          res.json({ status: "successfull", response: response.rows });
        }
      }
    );
  });

  //get method

  api.get("/exam_rules", (req, res) => {
    db.query(
      "SELECT * from exam_rules  where status=true ",
      (err, response) => {
        if (err) {
          console.log(err.stack);
        } else {
          console.log(response.rows);

          res.json({ exam_rules: response.rows });
        }
      }
    );
  });

  //get method for given id
  api.get("/exam_rules/:uuiduuid", (req, res) => {
    console.log(req.params.uuiduuid, "uuiduuid");
    db.query(
      `SELECT * from exam_rules where uuiduuid='${req.params.uuiduuid}'`,
      (err, response) => {
        if (err) {
          console.log(err.stack);
        } else {
          console.log(response.rows);
          res.json({ exam_rules: response.rows });
        }
      }
    );
  });

  //put method
  api.put("/exam_rules", (req, res) => {
    const { uuid, rule_name, updated_by, priority } = req.body;
    var validate = ajv.compile(exam_rule_model);
    var valid = validate(req.body);
    if (!valid) {
      console.log(validate.errors);
      return next({ Errors: validate.errors });
    }

    const updated_time = new Date().getTime();
    db.query(
      `UPDATE exam_rules set rule_name='${rule_name}',priority='${priority}',updated_by='${updated_by}',updated_time='${updated_time}' where uuid='${uuid}'`
    );
    res.json({ status: "Exam Rule Updated" });
  });

  //delete mathod
  api.delete("/exam_rules/:uuid", (req, res) => {
    db.query(
      `update exam_rules set status=false where uuid='${req.params.uuid}'`
    );
    res.json("Question Deleted");
  });

  //candidate Post map table api *******************************************************************************************************

  //post method

  api.post("/candidate_post_map", (req, res) => {
    const { uuid, post_id, user_id, created_by } = req.body;
    var validate = ajv.compile(candidate_post_map);
    var valid = validate(req.body);
    if (!valid) {
      console.log(validate.errors);
      return next({ Errors: validate.errors });
    }

    const created_time = new Date().getTime();
    db.query(
      `insert into candidate_post_map values('${uuid}','${user_id}','${post_id}',true,'${created_by}','${created_time}')`,
      (err, response) => {
        if (err) {
          console.log(err.stack);
        } else {
          console.log(response.rows);
          res.json("Candidate Post inserted");
        }
      }
    );
  });

  //get method

  api.get("/candidate_post_map", (req, res) => {
    db.query(
      "SELECT * from candidate_post_map where status=true",
      (err, response) => {
        if (err) {
          console.log(err.stack);
        } else {
          res.json({ candidate_post_map: response.rows });
        }
      }
    );
  });

  //get method for given id

  api.get("/candidate_post_map/:uuid", (req, res) => {
    db.query(
      `SELECT * from candidate_post_map where uuid='${req.params.uuid}'`,
      (err, response) => {
        if (err) {
          console.log(err.stack);
        } else {
          res.json({ posts: response.rows });
        }
      }
    );
  });

  //put method

  api.put("/candidate_post_map", (req, res) => {
    //take candidate_post_map candidate_post_map_id from path and find the id and update
    const { uuid, user_id, post_id, updated_by } = req.body;
    var validate = ajv.compile(candidate_post_map);
    var valid = validate(req.body);
    if (!valid) {
      console.log(validate.errors);
      return next({ Errors: validate.errors });
    }
    const updated_time = new Date().getTime();
    db.query(
      `UPDATE candidate_post_map set user_id='${user_id}',post_id='${post_id}',updated_by='${updated_by}',updated_time='${updated_time}' where uuid='${uuid}'`
    );
    res.json("Candidate_post_map Updated");
  });

  //delete method

  api.delete("/candidate_post_map/:uuid", (req, res) => {
    //take posts id from path and find the id and update flag
    db.query(
      `update candidate_post_map set status=false where uuid='${req.params.uuid}'`
    );
    res.json("Post Deleted");
  });

  //Candidate answer  api, for capturing user answer ******************************************************************************************************

  //post method

  //get method

  api.get("/user_candidate_answer", (req, res) => {
    //find all in candidate_post_map table and return the candidate_post_map
    db.query(
      `SELECT c_uuid,user_id,question_id,c_answer from candidate_answer`,
      (err, response) => {
        if (err) {
          console.log(err.stack);
        } else {
          res.json({ user_candidate_answer: response.rows });
        }
      }
    );
  });

  // put method

  api.put("/candidate_answer", (req, res) => {
    const { c_answer, question_id } = req.body;
    db.query(
      `update candidate_answer set c_answer='${c_answer}' where question_id='${question_id}'`,
      (err, response) => {
        if (err) {
          console.log(err.stack);
        } else {
          console.log(response.rows);
          res.json({ status: "successfull" });
        }
      }
    );
  });

  // Result Table for Admin and calculating user answer *******************************************************************************************

  //methoad for calculating total number of question

  let length = 0; //global variable

  const percentage = function(post_id) {
    db.query(
      `SELECT COUNT(q_name)
  FROM question_section where post_id='${post_id}' and status=true`,
      (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(res.rows[0].count);
          console.log(res.rows[0].count, "length");
          length = res.rows[0].count;
        }
      }
    );
    return length;
  };

  //method for calculating user marks, percentage and pass|| fail
  var response_user_id;
  api.post("/candidate_answer", (req, res) => {
    const insertion = function(candidate_answer) {
      console.log("insertion");
      const c_uuid = require("uuid/v1");
      var { answerList, user_id } = req.body;
      response_user_id = user_id;
      console.log("req - ", req.body);
      let arrr = [];
      console.log("next");
      answerList.map((user, index) => {
        if (user && user.questionId != null && user.answer != null) {
          return arrr.push(user);
        }
      });
      console.log(arrr, "req1");
      let rows = "";
      console.log("1");
      arrr.forEach(a => {
        if (rows.length != 0) {
          rows += ",";
        }
        let uuid = c_uuid().substr(4) + rows.length;
        console.log(a.questionId, "id");

        let question_id = a.questionId;

        let c_answer = a.answer;

        rows += `('${uuid}','${user_id}','${question_id}','${c_answer}')`;
      });
      console.log(rows, "rows");
      db.query(
        `insert into candidate_answer values ${rows}`,
        (err, response) => {
          if (err) {
            res.json({ status: "Failure", response: { err } });
          } else {
            candidate_answer(user_id);
            console.log("candidate answer , insertion  11");
            //  res.json({ status: "successfull", response: response.rows });
          }
        }
      );
      res.json({ status: "successfull" });
    };
    insertion(candidate_answer);

    // result_insert();
  });

  const candidate_answer = function(userid) {
    db.query(
      `SELECT uuid, threshold, post_id,q_uuid,q_answer,q_comment,user_id,question_id,c_answer,c_comment from post p inner join question_section q on p.uuid=q.post_id inner join candidate_answer c on q.q_uuid=c.question_id where user_id='${userid}' `,
      (err, response) => {
        if (err) {
          console.log(err.stack);
        } else {
          console.log(response.rows, "calc 12,13");
          let marks = 0;
          let c_length = 0;
          let threshold;
          response.rows.forEach((user, index) => {
            threshold = user.threshold;
            console.log(threshold, "threshold");
            if (user.q_answer == user.c_answer) {
              marks = marks + 20;
              c_length = c_length + 1;
            }
          });
          let obj = {};
          obj.marks = marks;
          obj.user = userid;
          obj.percentage = (c_length / length) * 100;
          if (marks >= threshold) {
            obj.result = "pass";
          } else {
            obj.result = "fail";
          }
          console.log(obj);
          result_insert(obj);
        }
      }
    );
  };

  const result_insert = function(obj) {
    const uuid = require("uuid/v1");
    db.query(
      `insert into result values('${obj.marks}','${obj.percentage}','${
        obj.user
      }','${uuid()}','${obj.result}')`,
      (err, response) => {
        if (err) {
          console.log(err.stack);
        } else {
          console.log("user , insertin done");
          console.log(response.rows, "sucess");
        }
      }
    );
  };

  //get method for showing given user_id result
  api.get("/result/:id?", (req, res) => {
    if (req.params.id == null) {
      db.query("SELECT * from result", (err, response) => {
        if (err) {
          console.log(err.stack);
        } else {
          console.log(response.rows);
          res.json({ result: response.rows });
        }
      });
    } else {
      db.query(
        `SELECT * from result where r_user_id='${req.params.id}'`,
        (err, response) => {
          if (err) {
            console.log(err.stack);
          } else {
            console.log(response.rows);
            res.json({ result: response.rows });
          }
        }
      );
    }
  });

  api.post("/feed_back", (req, res) => {
    //take posts from req and insert into posts table
    const { q_no, question, created_By } = req.body;

    //validation
    var validate = ajv.compile(exam_rule_model);
    var valid = validate(req.body);
    if (!valid) {
      console.log("exam_rule, post method", validate.errors);
      return next({ Errors: validate.errors });
    }

    const color = "white";
    const f_ans = 0;

    const uuid = require("uuid/v1");
    console.log(uuid(), "post");
    const created_time = new Date().getTime();

    db.query(
      `insert into feedback_question values('${uuid()}','${q_no}','${q_no}','${question}','${color}','${f_ans}','${created_By}','${created_time}',null,null)`,
      (err, response) => {
        if (err) {
          console.log(err.stack);
        } else {
          console.log(response.rows);
          res.json({ status: "successfull" });
        }
      }
    );
  });

  api.get("/feed_back", (req, res) => {
    db.query("SELECT * from feedback_question", (err, response) => {
      if (err) {
        console.log(err.stack);
      } else {
        console.log(response.rows);
        res.json({ result: response.rows });
      }
    });
  });

  api.post("/feed_back_response", (req, res) => {
    const c_uuid = require("uuid/v1");

    const user_id = response_user_id;

    var { result } = req.body;

    console.log("req - ", req.body);
    let arrr = [];

    result.map((user, index) => {
      if (user && user.question != null && user.f_ans != null) {
        return arrr.push(user);
      }
    });
    console.log(arrr, "req1");
    let rows = "";
    console.log(arrr, "1");

    arrr.forEach(a => {
      if (rows.length != 0) {
        rows += ",";
      }
      let res_uuid = c_uuid().substr(4) + rows.length;

      let question_id = a.question;

      let rate = a.f_ans;

      rows += `('${res_uuid}','${user_id}','${question_id}','${rate}')`;
    });
    console.log(rows, "rows");
    db.query(`insert into response values ${rows}`, (err, response) => {
      if (err) {
        res.json({ status: "Failure", response: { err } });
      } else {
        res.json({ status: "successfull", response: response.rows });
      }
    });
  });

  api.get("/response", (req, res) => {
    let rating = [];

    db.query(
      ` SELECT COUNT(user_id), SUM(rate),ques_id
    FROM response
    GROUP BY ques_id`,
      (err, response) => {
        if (err) {
          console.log(err.stack);
        } else {
          console.log(response.rows);

          response.rows.forEach(element => {
            let obj = {};
            obj.rate = element.sum / element.count;
            obj.ques = element.ques_id;
            rating.push(obj);
          });

          res.json({ result: rating });
        }
      }
    );
  });

  return api;
};
