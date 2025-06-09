// Get All Student Data

const db = require("../Config/db")

const getStudents = async(req,res) =>{
    try {
        const data = await db.query(' SELECT * FROM new_table')
        if(!data){
            return res.status(404).send({
                success : false,
                message : 'Reacords Not Found'
            })

        }
        res.status(200).send({
            success : true,
            message : 'All Records Students Data',
            totalstudents : data[0].length,
            data : data[0]
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success : false ,
            message : 'Error in Get All Students API',
            error
        })
        
    }
}

// GET Student BY ID
const StudentByID = async(req,res) =>{
    try {
        const StudentID = req.params.id;
        // MYSQL in Find Method
        
        if(!StudentID){
            return res.status(404).send({
                success : false,
                message : 'Invalid or Provide Student ID'
            })
        }
        const data = await db.query(' SELECT * FROM new_table WHERE id=?',[StudentID])
        if(!data){
            return res.status(404).send({
                success : false,
                message : 'No Records Found'
            })
        }
        res.status(200).send({
            success : true,
            message : 'Get Data BY Student ID',
            totalstudents : data[0].length,
            StudentDetails : data[0]
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success : false ,
            message : 'Error in Student BY ID API ',
            error
        })
        
    }
}

// Student Create API : POST
const CreateStudent = async (req, res) => {
    try {
        const { name, roll_no, fees, medium } = req.body;

        if (!name || !roll_no || !fees  || !medium) {
            return res.status(400).send({
                success: false,
                message: "Please provide all student fields"
            });
        }

        const data = await db.query(
            'INSERT INTO new_table (name, roll_no, fees, medium) VALUES (?, ?, ?, ?)',
            [name, roll_no, fees, medium]
        );

        if(!data){
            return res.status(404).send({
                success : false ,
                message : "Error in INSERT QUERY"
            })
        }

        return res.status(201).send({
            success: true,
            message: "Student created successfully",
            data : data
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error in Create Student API",
            error: error.message
        });
    }
};

module.exports = {getStudents,StudentByID,CreateStudent}