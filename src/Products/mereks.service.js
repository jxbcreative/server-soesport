const prisma = require('../db')

const getAllMerek = async() => {
    const mereks = await prisma.merek.findMany({
        include: {
            products: true
        }
    })

    return mereks;
}

const getMerekById = async(id) => {

    const merekId = await prisma.merek.findUnique({
        where: {
            id
        },
        include: {
            products: true
        }
    })

    return merekId
}

const createMerek = async(merekData) => {
    const merek = await prisma.merek.create({
        data: {
            name: merekData.name,
        },
        include: {
            products: true
        }
    })

    return merek
}

const updateMerek = async(id, merekData) => {
    await getMerekById(id)

    const merek = await prisma.merek.update({
        where: {
            id : parseInt(id)
        },
        data: {
            name: merekData.name
        },
        include: {
            products: true
        }
    })

    return merek
}

const deleteMerek = async(id) => {
    await getMerekById(id)
    await prisma.merek.delete({
        where: {
            id
        },
        include: {
            products: true
        }
    })
}

module.exports = {getAllMerek, getMerekById, createMerek, updateMerek, deleteMerek};