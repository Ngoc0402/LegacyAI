/**
 * LegacyAI – Vietnamese Family Role Engine (Extended FIXED)
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

const AFFINITY_MAP = {
  1: { male: 'Con rể', female: 'Con dâu' },
  2: { male: 'Cháu rể', female: 'Cháu dâu' },
  3: { male: 'Chắt rể', female: 'Chắt dâu' },
  4: { male: 'Chút rể', female: 'Chút dâu' },
  5: { male: 'Chít rể', female: 'Chít dâu' }
}

/**
 * Thứ tự trong dòng máu (giữ nguyên logic cũ)
 */
function getBloodOrder(person, list) {
  const sorted = [...list].sort((a, b) => a.birthYear - b.birthYear)
  const index = sorted.findIndex(p => p.id === person.id)

  if (index === 0) return 'cả'
  if (index === sorted.length - 1) return 'út'
  return 'thứ'
}

/**
 * Xác định vị trí vợ/chồng trong cùng nhóm
 */
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

/**
 * FIX: check đúng generation của chính người đó
 */
function getAffinityRole(person, groups, allMembers) {
  if (!person.spouseId) return null

  const spouse = allMembers.find(m => m.id === person.spouseId)
  if (!spouse) return null

  // 🔥 FIX: lấy đúng nhóm generation của person
  const sameGenGroup = groups[person.generation] || []

  const isSpouseInSameGroup = sameGenGroup.some(x => x.id === spouse.id)
  if (!isSpouseInSameGroup) return null

  const map = AFFINITY_MAP[person.generation]
  if (!map) return null

  return map[person.gender]
}

/**
 * CORE ENGINE
 */
function computeRole(person, groups, allMembers) {
  const sameGenGroup = groups[person.generation] || []

  const affinity = getAffinityRole(person, groups, allMembers)

  // 💍 Hôn nhân role ưu tiên cao nhất
  if (affinity) {
    const order = getInLawOrder(person, sameGenGroup, allMembers)
    return `${affinity} ${order}`
  }

  // 👨‍👩‍👧 Vai trò huyết thống
  const base = ROLE_MAP[person.generation]?.[person.gender] || 'Thành viên'

  if (person.generation === 1) {
    const order = getBloodOrder(person, sameGenGroup)
    return `${base} ${order}`
  }

  return base
}

/**
 * BUILD FULL ROLES
 */
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

/**
 * SUGGEST RELATIONSHIPS
 */
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

export { computeRole }