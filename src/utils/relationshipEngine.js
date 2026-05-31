/**
 * LegacyAI – Vietnamese Family Role Engine (Simplified)
 * Chỉ xác định VỊ TRÍ trong dòng họ theo thế hệ
 * Không suy luận xưng hô
 */
const ROLE_MAP = {
  0: { male: 'Tổ phụ', female: 'Tổ mẫu' },
  1: { male: 'Con trai', female: 'Con gái' },
  2: { male: 'Cháu trai', female: 'Cháu gái' },
  3: { male: 'Chắt trai', female: 'Chắt gái' },
  4: { male: 'Chút trai', female: 'Chút gái' },
  5: { male: 'Chít trai', female: 'Chít gái' }
}

function getBloodOrder(person, list) {
  const sorted = [...list].sort((a, b) => a.birthYear - b.birthYear)
  const index = sorted.findIndex(p => p.id === person.id)
  if (index === 0) return 'cả'
  if (index === sorted.length - 1) return 'út'
  return 'thứ'
}

function getSpouseBloodIndex(person, bloodList, allMembers) {
  const spouse = allMembers.find(m => m.id === person.spouseId)
  if (!spouse) return -1
  const sorted = [...bloodList].sort((a, b) => a.birthYear - b.birthYear)
  return sorted.findIndex(p => p.id === spouse.id)
}

function getInLawOrder(person, bloodList, allMembers) {
  const index = getSpouseBloodIndex(person, bloodList, allMembers)
  if (index === 0) return 'cả'
  if (index === bloodList.length - 1) return 'út'
  return 'thứ'
}

function getAffinityRole(person, bloodList, allMembers) {
  if (!person.spouseId) return null
  const spouse = allMembers.find(m => m.id === person.spouseId)
  if (!spouse) return null
  const isSpouseInBlood = bloodList.some(x => x.id === spouse.id)
  if (!isSpouseInBlood) return null

  return person.gender === 'female' ? 'Con dâu' : 'Rể'
}

function computeRole(person, groups, allMembers) {
  const gen1 = groups[1] || []
  const blood = gen1.filter(p => p.parentIds && p.parentIds.length > 0)
  const affinity = getAffinityRole(person, blood, allMembers)
  if (affinity) {
    const order = getInLawOrder(person, blood, allMembers)
    return `${affinity} ${order}`
  }

  const base = ROLE_MAP[person.generation]?.[person.gender] || 'Thành viên'
  if (person.generation === 1) {
    const order = getBloodOrder(person, blood)
    return `${base} ${order}`
  }

  return base
}

export function buildFamilyRoles(members) {
  const groups = {}
  for (const m of members) {
    if (!groups[m.generation]) groups[m.generation] = []
    groups[m.generation].push(m)
  }

  return members.map(m => ({
    ...m,
    role: computeRole(m, groups, members)
  }))
}

export function suggestRelationships(newMember, allMembers) {
  const combined = [...allMembers, newMember]
  const groups = {}
  for (const m of combined) {
    if (!groups[m.generation]) groups[m.generation] = []
    groups[m.generation].push(m)
  }

  return combined
    .filter(m => m.id !== newMember.id)
    .map(m => ({
      person: m,
      relationship: computeRole(m, groups, combined),
      description: `${m.name} - ${computeRole(m, groups, combined)}`,
      confidence: 100
    }))
}

export function getRelationshipLabel() {
  return 'Thành viên dòng họ'
}

export function getGenerationGap(a, b) {
  return Math.abs((a.generation ?? 0) - (b.generation ?? 0))
}