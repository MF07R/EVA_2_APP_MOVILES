### Cashi — App Mobile de Finanzas Personales 

App mobile desarrollada con React Native + Expo para gestionar ingresos y egresos personales.

## Tecnologías
- React Native + Expo
- TypeScript
- Expo Router
- AsyncStorage
- Zod

## Instalación

1. Clona el repositorio
git clone https://github.com/MF07R/EVA_2_APP_MOVILES

2. Instala las dependencias
yarn install

3. Corre la app
yarn start

4. Escanea el QR con Expo Go en tu teléfono

## Credenciales de prueba
- Email: mafer@cashi.cl
- Contraseña: 1234

## Funcionalidades
- Login con credenciales hardcodeadas
- CRUD completo de categorías
- CRUD completo de transacciones
- Pantalla de balance con total de ingresos, egresos y balance
- Persistencia de datos con AsyncStorage
- Validación de formularios con Zod

## Arquitectura
La lógica de negocio vive en custom hooks, los componentes solo renderizan:
- `useCategories` — CRUD de categorías con AsyncStorage
- `useTransactions` — CRUD de transacciones y cálculo de balance
- `useCategoryForm` — validación del formulario de categorías
- `useTransactionForm` — validación del formulario de transacciones

## Uso de IA
Se utilizó Claude (Anthropic) como asistente para el desarrollo.
de los estilos

## Autora
Maria Fernanda Rojas
