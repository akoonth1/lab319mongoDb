import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";



async function getSingleGrade(req, res) {

    let collection = db.collection('grades');
     try {

        let query = { _id: new ObjectId(req.params.id) };

        let result = await collection.findOne(query);
        res.json(result);
     } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error fetching grade" });
     }


}


//get grades for student
async function getStudentGrades(req, res) {

    let collection = db.collection('grades');
    try {
        let query = { "student_id": Number(req.params.id) };
        let result = await collection.find(query
        ).toArray();
        res.json(result);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error fetching grades" });
    }
}



//get grades for student
async function getClassGrades(req, res) {

    let collection = db.collection('grades');
    try {
        let query = { class_id: Number(req.params.id) };
        let result = await collection.find(query
        ).toArray();
        res.json(result);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error fetching grades" });
    }
}

// async function getStats(req, res) {
//   let collection = db.collection('grades');
//   try {
//     let query =
    
//       {"scores.score": {"$gt": 70}}
    




//     let result = await collection.find(query
//     ).toArray();
//     res.json(result);
// } catch (err) {
//       console.log(err);
//       res.status(500).json({ message: "Error fetching grades" });
//   }
// }


async function getStats(req, res) {

  let collection = db.collection('grades');
   try {

     let query = [
      {
        '$unwind': {
          'path': '$scores'
        }
      }, {
        '$addFields': {
          'weightedScore': {
            '$switch': {
              'branches': [
                {
                  'case': {
                    '$eq': [
                      '$scores.type', 'exam'
                    ]
                  }, 
                  'then': {
                    '$multiply': [
                      '$scores.score', 0.5
                    ]
                  }
                }, {
                  'case': {
                    '$eq': [
                      '$scores.type', 'quiz'
                    ]
                  }, 
                  'then': {
                    '$multiply': [
                      '$scores.score', 0.3
                    ]
                  }
                }, {
                  'case': {
                    '$eq': [
                      '$scores.type', 'homework'
                    ]
                  }, 
                  'then': {
                    '$multiply': [
                      '$scores.score', 0.1
                    ]
                  }
                }
              ], 
              'default': 0
            }
          }
        }
      }, {
        '$group': {
          '_id': {
            'student_id': '$student_id', 
            'class_id': '$class_id'
          }, 
          'avg': {
            '$sum': '$weightedScore'
          }
        }
      }, {
        '$group': {
          '_id': '$_id.student_id', 
          'student_avg': {
            '$avg': '$avg'
          }
        }
      }, {
        '$match': {
          'student_avg': {
            '$gt': 70
          }
        }
      }
    ]
    ;

      let result = await collection.aggregate(query).toArray();
      res.json({result, "Students that passed": result.length});
   } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error fetching grade" });
   }


}



async function getStatsID(req, res) {

  let collection = db.collection('grades');
   try {

     let query =[
      {
        '$match': {
          'class_id': Number(req.params.id)
        }
      }, {
        '$unwind': {
          'path': '$scores'
        }
      }, {
        '$addFields': {
          'weightedScore': {
            '$switch': {
              'branches': [
                {
                  'case': {
                    '$eq': [
                      '$scores.type', 'exam'
                    ]
                  }, 
                  'then': {
                    '$multiply': [
                      '$scores.score', 0.5
                    ]
                  }
                }, {
                  'case': {
                    '$eq': [
                      '$scores.type', 'quiz'
                    ]
                  }, 
                  'then': {
                    '$multiply': [
                      '$scores.score', 0.3
                    ]
                  }
                }, {
                  'case': {
                    '$eq': [
                      '$scores.type', 'homework'
                    ]
                  }, 
                  'then': {
                    '$multiply': [
                      '$scores.score', 0.1
                    ]
                  }
                }
              ], 
              'default': 0
            }
          }
        }
      }, {
        '$group': {
          '_id': {
            'student_id': '$student_id', 
            'class_id': '$class_id'
          }, 
          'student_avg': {
            '$sum': '$weightedScore'
          }
        }
      }, {
        '$match': {
          'student_avg': {
            '$gt': 70
          }
        }
      }
    ]
    ;

      let result = await collection.aggregate(query).toArray();
      res.json({result, "Students that passed": result.length});
   } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error fetching grade" });
   }


}



async function createGrade(req, res) {

    let collection = db.collection('grades');
    try {
        let result = await collection.insertOne(req.body);
        res.json(result);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error creating grade" });
    }
}



const student_schema = {
  "student_id": "number",
  "class_id": "number",
  "scores": {
      "exam": "number",
      "quiz": "number",
      "homework": "number"
  }
};      

async function validation(req, res)  {
  let collection = db.collection('grades');
  let newGrade = req.body;
  let isValid = true;

  // Validate the request body
  for (let key in student_schema) {
      if (typeof newGrade[key] !== student_schema[key]) {
          isValid = false;
          break;
      }
  }

  if (isValid) {
      try {
          let result = await collection.insertOne(newGrade);
          res.json(result);
      } catch (err) {
          console.log(err);
          res.status(500).json({ message: "Error creating grade" });
      }
  } else {
      res.status(400).json({ message: "Invalid request body" });
  }
};






export default {getSingleGrade, getStudentGrades, getClassGrades, createGrade, getStats, getStatsID, validation};



// [
//     {
//       '$unwind': {
//         'path': '$scores'
//       }
//     }, {
//       '$addFields': {
//         'weightedScore': {
//           '$switch': {
//             'branches': [
//               {
//                 'case': {
//                   '$eq': [
//                     '$scores.type', 'exam'
//                   ]
//                 }, 
//                 'then': {
//                   '$multiply': [
//                     '$scores.score', 0.5
//                   ]
//                 }
//               }, {
//                 'case': {
//                   '$eq': [
//                     '$scores.type', 'quiz'
//                   ]
//                 }, 
//                 'then': {
//                   '$multiply': [
//                     '$scores.score', 0.3
//                   ]
//                 }
//               }, {
//                 'case': {
//                   '$eq': [
//                     '$scores.type', 'homework'
//                   ]
//                 }, 
//                 'then': {
//                   '$multiply': [
//                     '$scores.score', 0.2
//                   ]
//                 }
//               }
//             ], 
//             'default': 0
//           }
//         }
//       }
//     }, {
//       '$group': {
//         '_id': '$student_id', 
//         'averageScore': {
//           '$avg': '$scores.score'
//         }
//       }
//     }, {
//       '$match': {
//         'averageScore': {
//           '$gt': 70
//         }
//       }
//     }
//   ]