# ⚡ ContestMaster - Corrections Rapides Prioritaires

## 🔴 CRITIQUES (À FAIRE IMMÉDIATEMENT)

### 1. **Remplacer schema.prisma**
```bash
# Backup ancien schema
cp prisma/schema.prisma prisma/schema.backup.prisma

# Utiliser le nouveau avec indexes
cp prisma/schema-improved.prisma prisma/schema.prisma

# Générer et migrer
npm run db:generate
npm run db:migrate
```

### 2. **Ajouter AuthModule**
Remplacer dans `app.module.ts` :
```typescript
imports: [
  AuthModule,  // AJOUTER CETTE LIGNE
  ContestsModule,
  // ...
]
```

### 3. **Activer Validation Globale**
Dans `main.ts`, ajouter :
```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
```

### 4. **Ajouter Exception Filter**
Dans `main.ts`, ajouter :
```typescript
app.useGlobalFilters(new GlobalExceptionFilter());
```

---

## 🟡 IMPORTANTES (Cette semaine)

### 5. **Remplacer Services**
```bash
# Contests
mv src/modules/contests/contests.service.ts src/modules/contests/contests.service.old.ts
mv src/modules/contests/contests.service.refactored.ts src/modules/contests/contests.service.ts

# Scoring
mv src/modules/scoring/scoring.service.ts src/modules/scoring/scoring.service.old.ts
mv src/modules/scoring/scoring.service.refactored.ts src/modules/scoring/scoring.service.ts

# Rules
mv src/modules/rules/rules.service.ts src/modules/rules/rules.service.old.ts
mv src/modules/rules/rules.service.refactored.ts src/modules/rules/rules.service.ts
```

### 6. **Mettre à jour Modules**
Dans `scoring.module.ts` :
```typescript
providers: [
  ScoringService,
  ScoreCalculatorService,      // AJOUTER
  AnomalyDetectorService,       // AJOUTER
  PrismaService
]
```

Dans `rules.module.ts` :
```typescript
providers: [
  RulesService,
  AgeLimitRuleStrategy,         // AJOUTER
  SubmissionCountRuleStrategy,  // AJOUTER
  CandidateLimitRuleStrategy,   // AJOUTER
  PrismaService
]
```

---

## 🟢 RECOMMANDÉES (Ce mois)

### 7. **Ajouter Tests**
```typescript
// contests.service.spec.ts
describe('ContestsService', () => {
  it('should create contest with valid dates', async () => {
    // ...
  });
  
  it('should throw error for invalid dates', async () => {
    // ...
  });
});
```

### 8. **Documentation API**
Installer Swagger :
```bash
npm install @nestjs/swagger swagger-ui-express
```

### 9. **Logging**
```bash
npm install winston nest-winston
```

---

## 📋 CHECKLIST RAPIDE

- [ ] Schema Prisma avec indexes
- [ ] AuthModule configuré
- [ ] Validation globale activée
- [ ] Exception filter global
- [ ] DTOs créés et utilisés
- [ ] Services refactorisés
- [ ] Controllers mis à jour
- [ ] Tests de base ajoutés
- [ ] Variables d'environnement configurées
- [ ] Documentation README mise à jour

---

## 🚨 ERREURS À ÉVITER

❌ **NE PAS** :
- Utiliser `any` dans les types
- Mettre logique métier dans controllers
- Oublier validation sur endpoints publics
- Exposer erreurs Prisma au client
- Faire requêtes N+1 dans boucles

✅ **TOUJOURS** :
- Utiliser DTOs avec validation
- Injecter dépendances
- Gérer erreurs proprement
- Utiliser `include` pour relations
- Paginer résultats

---

## 📞 SUPPORT

Si problème lors de la migration :
1. Vérifier logs console
2. Vérifier `.env` configuré
3. Vérifier database accessible
4. Consulter `REFACTORING_REPORT.md`
