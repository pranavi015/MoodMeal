import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function xyz(){
    req.body={title,description,category,nutritionalBenefits}
    const curatedMeals = await prisma.curatedMeal.createMany({
        data:{
            "title": title,
            "description":description,
            "category":category,
            "nutritionalBenefits":nutritionalBenefits
        }
        
    })
}