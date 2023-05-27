const express = require("express");
const router = express.Router();
const verifyToken = require("../Auth/verifyToken");
const {getAllMerek, createMerek, getMerekById, updateMerek, deleteMerek} = require("./mereks.service");


router.get("/", verifyToken, async (req, res) => {
  const mereks = await getAllMerek();

  res.status(200).json({ message: "Succes get merek", mereks });
});

router.get("/:id", verifyToken, async(req, res) => {
  try {

    const merekId = req.params.id

    const merek = await getMerekById(merekId)
    
    if(!merek) return res.status(404).json({message: "Merek not found"})

    res.status(200).json({
      message: "Success get data merek",
      merek
    })
    
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

router.post("/", verifyToken, async(req, res) => {
  try {
    const merekData = req.body;

    const merek = await createMerek(merekData)

    res.status(201).json({message: "Success created", merek})
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

router.put("/:id", async(req, res) => {
  try {
    const merekId = parseInt(req.params.id)
    if(!merekId) res.status(404).json({message: "Merek not found"})

    const merekData = req.body;

    const merek = await updateMerek(merekId, merekData)

    res.status(201).json({message: "Success updated", merek})

  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

router.delete("/:id", async(req, res) => {
  try {
    const merekId = req.params.id

    await deleteMerek(merekId)

    res.status(200).json({message: "Success delete data"})
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

module.exports = router;
