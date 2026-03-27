from sklearn.metrics import accuracy_score, r2_score, mean_absolute_error

def evaluate(models, X_test, y_test, task):
    results = {}

    for name, model in models.items():
        y_pred = model.predict(X_test)

        if task == "classification":
            results[name] = accuracy_score(y_test, y_pred)
        else:
            results[name] = r2_score(y_test, y_pred)

    return results


def get_best_model(results, models):
    best_name = max(results, key=results.get)
    return best_name, models[best_name]