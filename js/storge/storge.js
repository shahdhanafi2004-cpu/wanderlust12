
export class StorageManager {
    constructor() {
        this.key = "wanderlustPlans";
    }

    getPlans() {
        return JSON.parse(
            localStorage.getItem(this.key)
        ) || [];
    }

    savePlan(plan) {
        const plans = this.getPlans();

        // Check if plan already exists
        if (plans.some(item => item.id === plan.id)) {
            return false;
        }

        plans.push(plan);

        localStorage.setItem(
            this.key,
            JSON.stringify(plans)
        );

        return true;
    }

    deletePlan(id) {
        const plans = this.getPlans();

        const updatedPlans = plans.filter(
            item => item.id !== id
        );

        localStorage.setItem(
            this.key,
            JSON.stringify(updatedPlans)
        );
    }

    clearPlans() {
        localStorage.removeItem(this.key);
    }
}
