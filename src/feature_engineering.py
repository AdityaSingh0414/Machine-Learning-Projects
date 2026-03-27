from sklearn.feature_selection import SelectKBest, chi2
from sklearn.decomposition import PCA

def feature_selection(X, y, k=5):
    selector = SelectKBest(score_func=chi2, k=min(k, X.shape[1]))
    X_new = selector.fit_transform(X, y)
    return X_new


def apply_pca(X, n_components=2):
    pca = PCA(n_components=min(n_components, X.shape[1]))
    X_pca = pca.fit_transform(X)
    return X_pca