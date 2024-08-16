import { Asset, AssetManager, assetManager, resources } from 'cc';

export default class ResMgr {
    public static load<T extends Asset>(bundleName: string, path: string) {
        if (bundleName) {
            return this.loadBundleRes<T>(bundleName, path)
        }
        return this.loadRes<T>(path)
    }

    public static loadRemote<T extends Asset>(path: string) {
        return new Promise<T>((resolve, reject) => {
            assetManager.loadRemote(path, (err: Error, asset: T) => {
                if (err) {
                    reject(err)
                    return
                }

                resolve(asset)
            })
        })
    }

    public static loadBundle(bundleName: string) {
        return new Promise<AssetManager.Bundle>((resolve, reject) => {
            const bundle = assetManager.getBundle(bundleName)

            if (bundle) {
                resolve(bundle)
                return
            }

            assetManager.loadBundle(bundleName, (err: Error, bundle: AssetManager.Bundle) => {
                if (err) {
                    reject(err)
                    return
                }

                resolve(bundle)
            })
        })
    }

    public static loadBundleRes<T extends Asset>(bundleName: string, path: string, type?: typeof Asset) {
        return new Promise<T>((resolve, reject) => {
            this.loadBundle(bundleName).then(bundle => {
                bundle.load(path, type, (err: Error, asset: T) => {
                    if (err) {
                        reject(err)
                        return
                    }

                    resolve(asset)
                })
            }).catch(err => {
                reject(err)
            })
        })
    }


    public static loadBundleResDir<T extends Asset>(bundleName: string, path: string, type?: typeof Asset) {
        return new Promise<T[]>((resolve, reject) => {
            this.loadBundle(bundleName).then(bundle => {
                bundle.loadDir(path, type, (err: Error, assets: T[]) => {
                    if (err) {
                        reject(err)
                        return
                    }

                    resolve(assets)
                })
            }).catch(err => {
                reject(err)
            })
        })
    }

    public static loadBundleResArray<T extends Asset>(bundleName: string, names: string[], type?: typeof Asset) {
        return new Promise<T[]>((resolve, reject) => {
            this.loadBundle(bundleName).then(bundle => {
                bundle.load(names, type, (err: Error, assets: T[]) => {
                    if (err) {
                        reject(err)
                        return
                    }

                    resolve(assets)
                })
            }).catch(err => {
                reject(err)
            })
        })
    }

    public static loadResDir<T extends Asset>(dir: string, type?: typeof Asset) {
        return new Promise<T[]>((resolve, reject) => {
            resources.loadDir(dir, type, (err: Error, assets: T[]) => {
                if (err) {
                    reject(err)
                    return
                }

                resolve(assets)
            })
        })
    }

    public static loadResArray<T extends Asset>(names: string[], type?: typeof Asset) {
        return new Promise<T[]>((resolve, reject) => {
            resources.load(names, type, (err: Error, assets: T[]) => {
                if (err) {
                    reject(err)
                    return
                }

                resolve(assets)
            })
        })
    }

    public static loadRes<T extends Asset>(path: string, type?: typeof Asset) {
        return new Promise<T>((resolve, reject) => {
            resources.load(path, type, (err: Error, assets: T) => {
                if (err) {
                    reject(err)
                    return
                }

                resolve(assets)
            })
        })
    }
}