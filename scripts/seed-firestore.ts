import * as admin from 'firebase-admin'
import { Program, Cohort, Company, DealStage, EvalCriteria, AppUser, Ask, CompanyAvgScore, EvalScore } from '../types'

// Use Firebase Admin SDK
import { adminDb } from '../lib/firebase-admin'

const programs: Partial<Program>[] = [
    { name: 'FoodSeed 2025', sector: ['Agritech', 'Biotech'], startup_stage: 'Seed', duration: { value: 6, type: 'months' }, partnerships: ['CDTI'] },
    { name: 'Mylkcubator 3.0', sector: ['Innovative Food', 'Dairy'], startup_stage: 'Early Revenue', duration: { value: 4, type: 'months' }, partnerships: ['Pascual Innoventures'] },
    { name: 'Raíces Agrifoodtech', sector: ['Deep Tech', 'Agritech'], startup_stage: 'Pre-seed', duration: { value: 5, type: 'months' }, partnerships: ['Alianza'] },
    { name: 'CCB 2025', sector: ['Sustainable Supply Chain'], startup_stage: 'Growth', duration: { value: 6, type: 'months' }, partnerships: ['Caja de Burgos'] },
    { name: 'Amazonia 2024', sector: ['Agritech', 'Biotech'], startup_stage: 'Seed', duration: { value: 3, type: 'months' }, partnerships: ['BID'] },
    { name: 'Spain Foodtech', sector: ['Smart Distribution', 'Innovative Food'], startup_stage: 'Growth', duration: { value: 12, type: 'months' }, partnerships: ['ICEX'] },
]

const dealStages = [
    { title: 'Applied', code: 'applied', sequence: 1 },
    { title: 'Under Review', code: 'under_review', sequence: 2 },
    { title: 'Shortlisted', code: 'shortlisted', sequence: 3 },
    { title: 'Interview', code: 'interview', sequence: 4 },
    { title: 'Selected', code: 'selected', sequence: 5 },
    { title: 'Rejected', code: 'rejected', sequence: 6 },
]

const evalCriteria = [
    { title: 'Founders', value: 25, round: 2, description: 'Team experience and commitment' },
    { title: 'IP Protection', value: 15, round: 2, description: 'Patents and intellectual property' },
    { title: 'Uniqueness', value: 15, round: 2, description: 'Market differentiation' },
    { title: 'Market', value: 20, round: 2, description: 'Market size and growth potential' },
    { title: 'Return on Investment', value: 25, round: 2, description: 'Financial potential' },
]

const users: Partial<AppUser>[] = [
    { first_name: 'Marta', last_name: 'Gironés', email: 'marta@eatableadventures.com', tag: 'programteam' },
    { first_name: 'Jose', last_name: 'Luis', email: 'joseluis@eatableadventures.com', tag: 'programteam' },
    { first_name: 'Elena', last_name: 'García', email: 'elena@eatableadventures.com', tag: 'programteam' },
    { first_name: 'Raúl', last_name: 'Martín', email: 'raul@eatableadventures.com', tag: 'programteam' },
    { first_name: 'Sofía', last_name: 'Pérez', email: 'sofia@eatableadventures.com', tag: 'programteam' },
    { first_name: 'Carlos', last_name: 'Ruiz', email: 'carlos@eatableadventures.com', tag: 'programteam' },
    { first_name: 'Ana', last_name: 'López', email: 'ana@eatableadventures.com', tag: 'programteam' },
    { first_name: 'Luis', last_name: 'Fernández', email: 'luis@eatableadventures.com', tag: 'programteam' },
]

const startups = [
    'Nu-Cibo', 'AgroMind', 'BioFerment', 'GreenChain', 'DairyNext',
    'AquaHarvest', 'SeedLink', 'ProteinX', 'FlavorLabs', 'SmartStore',
    'Rooted', 'EcoPack', 'AgriSense', 'MycoFood', 'VeggieFlow',
    'SolarGrow', 'PureWater', 'FertilePath', 'LogiFood', 'DeepSea',
    'NanoFeed', 'UrbanFarms', 'HiveMind', 'CropGuard', 'SafeSupply',
    'NatureTech', 'FreshRoute', 'BioBasis', 'GrainGrow', 'NutriScale',
    'AgroDrone', 'SoilSmart', 'LeafLogic', 'ColdChain', 'ZeroWaste',
    'HarvestHi', 'MicroGreen', 'FutureFood', 'PrimeAgrar', 'Oasis'
]

async function seed() {
    console.log('Starting seed process...')

    // Programs & Cohorts
    for (const p of programs) {
        const pRef = adminDb.collection('programs').doc()
        await pRef.set({
            ...p,
            id: pRef.id,
            createdDate: admin.firestore.Timestamp.now()
        })

        const cohortRef = adminDb.collection('cohorts').doc()
        await cohortRef.set({
            id: cohortRef.id,
            name: `${p.name} - Cohort 1`,
            program_id: pRef.id,
            start_date: admin.firestore.Timestamp.now(),
            form_type: 'formio',
            description: `Inaugural cohort for ${p.name}`
        })

        // Deal Stages for each cohort
        for (const stage of dealStages) {
            const stageRef = adminDb.collection('deal_stages').doc()
            await stageRef.set({
                ...stage,
                id: stageRef.id,
                cohort_id: cohortRef.id,
                active: true
            })
        }

        // Evaluation Criteria for each cohort
        for (const criteria of evalCriteria) {
            const criteriaRef = adminDb.collection('eval_criteria').doc()
            await criteriaRef.set({
                ...criteria,
                id: criteriaRef.id,
                cohort_id: cohortRef.id
            })
        }

        // Allocate 6-7 startups to each program
        const programIndex = programs.indexOf(p)
        const programStartups = startups.slice(programIndex * 6, (programIndex + 1) * 6)

        for (const trade_name of programStartups) {
            const companyRef = adminDb.collection('companies').doc()
            const bz_rand = Math.random()
            const bz_approval = bz_rand > 0.4 ? 'accepted' : (bz_rand > 0.2 ? 'pending' : 'rejected')

            const stage_rand = Math.floor(Math.random() * dealStages.length)
            const tracking_stage = dealStages[stage_rand].code

            const sectors = ['Agritech', 'Biotech', 'Innovative Food', 'Deep Tech', 'Sustainable Supply Chain', 'Smart Distribution']
            const stages = ['Idea', 'Pre-seed', 'Seed', 'Early Revenue', 'Growth']
            const cities = ['Madrid', 'Barcelona', 'London', 'Berlin', 'Paris', 'Amsterdam', 'Lisbon', 'Milan']

            await companyRef.set({
                id: companyRef.id,
                trade_name,
                website: `https://www.${trade_name.toLowerCase()}.ai`,
                city: cities[Math.floor(Math.random() * cities.length)],
                country: 'Seed',
                sector: sectors[Math.floor(Math.random() * sectors.length)],
                business_stage: stages[Math.floor(Math.random() * stages.length)],
                cohort_id: cohortRef.id,
                program_id: pRef.id,
                bz_approval,
                tracking_stage,
                createdDate: admin.firestore.Timestamp.now()
            })

            // If accepted or pending, maybe add scores
            if (Math.random() > 0.5) {
                const criteriaList = await adminDb.collection('eval_criteria').where('cohort_id', '==', cohortRef.id).get()
                let totalWeightedScore = 0
                let totalPossible = 0

                for (const cDoc of criteriaList.docs) {
                    const criteria = cDoc.data() as EvalCriteria
                    const scoreValue = Math.floor(Math.random() * 5) + 1 // 1-5

                    const scoreRef = adminDb.collection('eval_scores').doc()
                    await scoreRef.set({
                        id: scoreRef.id,
                        company_id: companyRef.id,
                        criteria_id: criteria.id,
                        score: scoreValue,
                        evaluator_id: 'seed-id',
                        cohort_id: cohortRef.id,
                        round: 2
                    })

                    totalWeightedScore += (scoreValue / 5) * criteria.value
                    totalPossible += criteria.value
                }

                const avg_score = Math.round((totalWeightedScore / totalPossible) * 100)

                const avgScoreRef = adminDb.collection('company_avg_scores').doc()
                await avgScoreRef.set({
                    id: avgScoreRef.id,
                    company_id: companyRef.id,
                    cohort_id: cohortRef.id,
                    avg_score,
                    round: 2
                })
            }
        }
    }

    // Users
    for (const u of users) {
        const userRef = adminDb.collection('users').doc()
        await userRef.set({ ...u, id: userRef.id })
    }

    // Asks
    const categories = ['Mentor Connect', 'Document Request', 'Milestone Review', 'Interview Schedule', 'Follow Up']
    const statuses = ['Open', 'Pending', 'Closed']

    const companyDocs = await adminDb.collection('companies').limit(20).get()

    for (const cDoc of companyDocs.docs) {
        const askRef = adminDb.collection('asks').doc()
        const company = cDoc.data() as Company
        const dueDate = new Date()
        dueDate.setDate(dueDate.getDate() + (Math.floor(Math.random() * 60) - 30))

        await askRef.set({
            id: askRef.id,
            title: `${categories[Math.floor(Math.random() * categories.length)]} for ${company.trade_name}`,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            company_id: company.id,
            category: categories[Math.floor(Math.random() * categories.length)],
            due_date: admin.firestore.Timestamp.fromDate(dueDate),
            assigned_to: 'seed-user-id',
            program_id: company.program_id,
            cohort_id: company.cohort_id,
            createdDate: admin.firestore.Timestamp.now()
        })
    }

    console.log('Seed completed successfully!')
}

seed().catch(err => {
    console.error('Error seeding data:', err)
    process.exit(1)
})
