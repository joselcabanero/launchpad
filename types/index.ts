import { Timestamp } from 'firebase/firestore'

export interface Program {
    id: string
    name: string
    description?: string
    sector: string[]
    startup_stage: string
    duration: { value: number; type: 'months' | 'weeks' }
    partnerships: string[]
    createdDate: Timestamp
}

export interface Cohort {
    id: string
    name: string
    program_id: string
    start_date: Timestamp
    end_date?: Timestamp
    form_type: 'formio' | 'tcnform'
    description?: string
}

export type ApprovalStatus = 'accepted' | 'rejected' | 'pending' | 'review'
export type BusinessStage = 'Idea' | 'Pre-seed' | 'Seed' | 'Early Revenue' | 'Growth'

export interface Company {
    id: string
    trade_name: string
    website?: string
    city?: string
    country?: string
    sector: string
    sub_sectors?: string[]
    business_stage: BusinessStage
    cohort_id: string
    program_id: string
    bz_approval: ApprovalStatus
    tracking_stage: string   // matches DealStage.code
    createdDate: Timestamp
}

export interface DealStage {
    id: string
    title: string
    code: string
    cohort_id: string
    sequence: number
    active: boolean
}

export interface EvalCriteria {
    id: string
    title: string
    value: number           // max points (e.g. 25)
    round: number
    cohort_id: string
    description: string
}

export interface EvalScore {
    id: string
    company_id: string
    criteria_id: string
    score: number
    evaluator_id: string
    cohort_id: string
    round: number
}

export interface CompanyAvgScore {
    id: string
    company_id: string
    cohort_id: string
    avg_score: number       // 0–100
    round: number
}

export type AskStatus = 'Open' | 'Closed' | 'Pending'

export interface Ask {
    id: string
    title: string
    short_description?: string
    status: AskStatus
    company_id: string
    category: string
    due_date: Timestamp
    assigned_to: string     // user id
    program_id: string
    cohort_id: string
    createdDate: Timestamp
}

export interface Label {
    id: string
    name: string
    color: string
}

export type UserTag = 'programteam' | 'company' | 'external'

export interface AppUser {
    id: string
    first_name: string
    last_name: string
    email: string
    tag: UserTag
    profile_picture?: string
}
